import { ApiPromise } from "@polkadot/api";
import { Abi } from "@polkadot/api-contract";
import { ContractCallOutcome } from "@polkadot/api-contract/types";
import type { ApiDecoration } from "@polkadot/api/types";
import type { ContractExecResult } from "@polkadot/types/interfaces";
import BN from "bn.js";
import { firstValueFrom, map } from "rxjs";
import {
  SignAndSendSuccessResponse,
  _genValidGasLimitAndValue,
} from "wookashwackomytest-typechain-types";
import {
  CHANGE_TOKEN_ALLOWANCES_MATCHER,
  CHANGE_TOKEN_BALANCES_MATCHER,
} from "./constants";
import { convertWeight, getApiAt } from "./tmp/abaxfinance/utils";
import { preventAsyncMatcherChaining } from "./utils";

async function getAllowanceOf(
  token: any,
  owner: string,
  spender: string,
  apiPre: ApiDecoration<"promise">
): Promise<BN> {
  const message = (token.contractAbi as Abi).findMessage("PSP22::allowance");
  const encoded = message.toU8a([owner, spender]);
  const observable = apiPre.rx.call.contractsApi
    .call<ContractExecResult>(
      owner,
      token.address,
      0,
      (await _genValidGasLimitAndValue(token.nativeAPI)).gasLimit!,
      null, //storageDepositLimit
      encoded
    )
    .pipe(
      map(
        ({
          debugMessage,
          gasConsumed,
          gasRequired,
          result,
          storageDeposit,
        }): ContractCallOutcome => ({
          debugMessage,
          gasConsumed,
          gasRequired:
            gasRequired && !convertWeight(gasRequired).v1Weight.isZero()
              ? gasRequired
              : gasConsumed,
          output:
            result.isOk && message.returnType
              ? (token.contractAbi as Abi).registry.createTypeUnsafe(
                  message.returnType.lookupName || message.returnType.type,
                  [result.asOk.data.toU8a(true)],
                  {
                    isPedantic: true,
                  }
                )
              : null,
          result,
          storageDeposit,
        })
      )
    );
  const allowance = await firstValueFrom(observable);
  if ((allowance.output as any).isOk) {
    return (allowance.output as any).asOk as BN;
  }
  throw new Error(`balanceOf failed ${allowance.debugMessage}`);
}

async function changeTokenAllowances(
  this: Chai.AssertionPrototype,
  token: any,
  ownersAndSpenders: [string, string][],
  deltas: BN[]
): Promise<void> {
  //
  const tx: SignAndSendSuccessResponse = this._obj;
  if (!tx.blockHash) {
    throw new Error("blockHash is not defined");
  }
  const block = await (token.nativeAPI as ApiPromise).rpc.chain.getBlock(
    tx.blockHash
  );
  const postTxBlockNumber = block.block.header.number.toNumber();
  const preTxBlockNumber = postTxBlockNumber - 1;

  //get balances pre
  const apiPre = await getApiAt(token.nativeAPI, preTxBlockNumber);
  const preBalances = await Promise.all(
    ownersAndSpenders.map((ownerAndSpender) =>
      getAllowanceOf(token, ownerAndSpender[0], ownerAndSpender[1], apiPre)
    )
  );
  //get balances post
  const apiPost = await getApiAt(token.nativeAPI, postTxBlockNumber);
  const postBalances = await Promise.all(
    ownersAndSpenders.map((ownerAndSpender) =>
      getAllowanceOf(token, ownerAndSpender[0], ownerAndSpender[1], apiPost)
    )
  );
  //check
  for (let i = 0; i < ownersAndSpenders.length; i++) {
    const pre = preBalances[i];
    const post = postBalances[i];
    const delta = deltas[i];
    const expected = pre.add(delta);
    this.assert(
      post.eq(expected),
      `expected allowance of ${ownersAndSpenders[i][0]} to spend tokens of ${
        ownersAndSpenders[i][1]
      } to be ${expected.toString()} but got ${post.toString()}`,
      `expected balance of ${ownersAndSpenders[i][0]} to spend tokens of ${
        ownersAndSpenders[i][1]
      } not to be ${expected.toString()} but got ${post.toString()}`,
      expected.toString(),
      post.toString(),
      true
    );
  }
}

export function supportChangeTokenAllowances(
  Assertion: Chai.AssertionStatic,
  chaiUtils: Chai.ChaiUtils
) {
  Assertion.addMethod(
    CHANGE_TOKEN_ALLOWANCES_MATCHER,
    function (
      this: Chai.AssertionPrototype,
      token: any,
      ownersAndSpenders: [string, string][],
      deltas: BN[]
    ) {
      preventAsyncMatcherChaining(
        this,
        CHANGE_TOKEN_BALANCES_MATCHER,
        chaiUtils
      );

      const derivedPromise = changeTokenAllowances.apply(this, [
        token,
        ownersAndSpenders,
        deltas,
      ]);
      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
