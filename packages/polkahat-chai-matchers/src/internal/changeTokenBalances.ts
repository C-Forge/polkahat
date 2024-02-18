import { ApiPromise } from "@polkadot/api";
import BN from "bn.js";
import {
  SignAndSendSuccessResponse,
  _genValidGasLimitAndValue,
} from "wookashwackomytest-typechain-types";
import { CHANGE_TOKEN_BALANCES_MATCHER } from "./constants";
import { convertWeight, getApiAt } from "./tmp/abaxfinance/utils";
import { preventAsyncMatcherChaining } from "./utils";
import type { ApiDecoration } from "@polkadot/api/types";
import { Abi } from "@polkadot/api-contract";
import type {
  AccountId,
  WeightV1,
  WeightV2,
  ContractExecResult,
} from "@polkadot/types/interfaces";
import { firstValueFrom, map } from "rxjs";
import { ContractCallOutcome } from "@polkadot/api-contract/types";

async function getBalanceOf(
  token: any,
  address: string,
  apiPre: ApiDecoration<"promise">
): Promise<BN> {
  const message = (token.contractAbi as Abi).findMessage("PSP22::balance_of");
  const encoded = message.toU8a([address]);
  const observable = apiPre.rx.call.contractsApi
    .call<ContractExecResult>(
      address,
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
  const balanceOf = await firstValueFrom(observable);
  if ((balanceOf.output as any).isOk) {
    return (balanceOf.output as any).asOk as BN;
  }
  throw new Error(`balanceOf failed ${balanceOf.debugMessage}`);
}
async function changeTokenBalances(
  this: Chai.AssertionPrototype,
  token: any,
  addresses: string[],
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
    addresses.map((address) => getBalanceOf(token, address, apiPre))
  );
  //get balances post
  const apiPost = await getApiAt(token.nativeAPI, postTxBlockNumber);
  const postBalances = await Promise.all(
    addresses.map((address) => getBalanceOf(token, address, apiPost))
  );
  //check
  for (let i = 0; i < addresses.length; i++) {
    const pre = preBalances[i];
    const post = postBalances[i];
    const delta = deltas[i];
    const expected = pre.add(delta);
    this.assert(
      post.eq(expected),
      `expected balance of ${
        addresses[i]
      } to be ${expected.toString()} but got ${post.toString()}`,
      `expected balance of ${
        addresses[i]
      } not to be ${expected.toString()} but got ${post.toString()}`,
      expected.toString(),
      post.toString(),
      true
    );
  }
}

export function supportChangeTokenBalances(
  Assertion: Chai.AssertionStatic,
  chaiUtils: Chai.ChaiUtils
) {
  Assertion.addMethod(
    CHANGE_TOKEN_BALANCES_MATCHER,
    function (
      this: Chai.AssertionPrototype,
      token: any,
      addresses: string[],
      deltas: BN[]
    ) {
      preventAsyncMatcherChaining(
        this,
        CHANGE_TOKEN_BALANCES_MATCHER,
        chaiUtils
      );

      const derivedPromise = changeTokenBalances.apply(this, [
        token,
        addresses,
        deltas,
      ]);
      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
