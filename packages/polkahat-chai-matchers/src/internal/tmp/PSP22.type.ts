import type { Abi, ContractPromise } from "@polkadot/api-contract";
import type { ApiPromise } from "@polkadot/api";
import type {
  GasLimit,
  Result,
  ReturnNumber,
  SignAndSendSuccessResponse,
} from "wookashwackomytest-typechain-types";
import type { QueryReturnType } from "wookashwackomytest-typechain-types";
import type BN from "bn.js";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { LangError } from "./abaxfinance/utils";
import type { AccountId, PSP22Error } from "./abaxfinance/contract-helpers";
import { EventTypeDescriptions } from "./eventtypedescriptor.type";

export interface PSP22Query {
  totalSupply(
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<ReturnNumber, LangError>>>;
  balanceOf(
    owner: AccountId,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<ReturnNumber, LangError>>>;
  allowance(
    owner: AccountId,
    spender: AccountId,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<ReturnNumber, LangError>>>;
  transfer(
    to: AccountId,
    value: string | number | BN,
    data: Array<string | number | BN>,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<Result<null, PSP22Error>, LangError>>>;
  transferFrom(
    from: AccountId,
    to: AccountId,
    value: string | number | BN,
    data: Array<string | number | BN>,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<Result<null, PSP22Error>, LangError>>>;
  approve(
    spender: AccountId,
    value: string | number | BN,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<Result<null, PSP22Error>, LangError>>>;
  increaseAllowance(
    spender: AccountId,
    deltaValue: string | number | BN,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<Result<null, PSP22Error>, LangError>>>;
  decreaseAllowance(
    spender: AccountId,
    deltaValue: string | number | BN,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<Result<null, PSP22Error>, LangError>>>;
  tokenName(
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<string | null, LangError>>>;
  tokenSymbol(
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<string | null, LangError>>>;
  tokenDecimals(
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<ReturnNumber, LangError>>>;
  mint(
    to: AccountId,
    amount: string | number | BN,
    __options?: GasLimit
  ): Promise<QueryReturnType<Result<Result<null, PSP22Error>, LangError>>>;
}

export interface PSP22Tx {
  totalSupply(__options?: GasLimit): Promise<SignAndSendSuccessResponse>;
  balanceOf(
    owner: AccountId,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  allowance(
    owner: AccountId,
    spender: AccountId,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  transfer(
    to: AccountId,
    value: string | number | BN,
    data: Array<string | number | BN>,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  transferFrom(
    from: AccountId,
    to: AccountId,
    value: string | number | BN,
    data: Array<string | number | BN>,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  approve(
    spender: AccountId,
    value: string | number | BN,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  increaseAllowance(
    spender: AccountId,
    deltaValue: string | number | BN,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  decreaseAllowance(
    spender: AccountId,
    deltaValue: string | number | BN,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
  tokenName(__options?: GasLimit): Promise<SignAndSendSuccessResponse>;
  tokenSymbol(__options?: GasLimit): Promise<SignAndSendSuccessResponse>;
  tokenDecimals(__options?: GasLimit): Promise<SignAndSendSuccessResponse>;
  mint(
    to: AccountId,
    amount: string | number | BN,
    __options?: GasLimit
  ): Promise<SignAndSendSuccessResponse>;
}

export interface PSP22 {
  readonly query: PSP22Query;
  readonly tx: PSP22Tx;
  readonly nativeContract: ContractPromise;
  readonly address: string;
  readonly nativeAPI: ApiPromise;
  readonly contractAbi: Abi;
  readonly eventDataTypeDescriptions: EventTypeDescriptions;
  withSigner: (signer: KeyringPair) => PSP22;
  withAddress: (address: string) => PSP22;
  withAPI: (api: ApiPromise) => PSP22;
}