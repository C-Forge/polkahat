/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import BN from "bn.js";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { ApiPromise } from "@polkadot/api";
import type { ReturnNumber } from "wookashwackomytest-typechain-types";
function isObject<T>(obj: any): obj is T {
  return typeof obj === "object" && obj !== null;
}

export type ChangeTypeOfKeys<T extends object> = {
  [key in keyof T]: T[key] extends number | BN | ReturnNumber ? string : T[key];
};

export function replaceNumericPropsWithStrings<T extends object>(
  obj: T
): ChangeTypeOfKeys<T> {
  if (isObject(obj)) {
    const newObj = obj;
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const currentVal = obj[key] as any;
      if (currentVal?.rawNumber) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        newObj[key] = currentVal.rawNumber.toString();
      } else if (BN.isBN(currentVal)) {
        newObj[key] = currentVal.toString() as any;
      } else if (typeof currentVal === "number") {
        newObj[key] = currentVal.toString() as any;
      } else if (isObject(obj[key])) {
        newObj[key] = replaceNumericPropsWithStrings(obj[key] as any) as any;
      }
    }

    return newObj as ChangeTypeOfKeys<T>;
  }

  return obj;
}

export const getContractObject = <T>(
  constructor: new (address: string, signer: KeyringPair, api: ApiPromise) => T,
  contractAddress: string,
  signerPair: KeyringPair,
  api: ApiPromise
) => new constructor(contractAddress, signerPair, api);

export type AccountId = string | number[];

export type Hash = string | number[];

export type TransferEventData = {
  from: AccountId | null;
  to: AccountId | null;
  amount: ReturnNumber;
};

export interface PSP22Error {
  custom?: string;
  insufficientBalance?: null;
  insufficientAllowance?: null;
  zeroRecipientAddress?: null;
  zeroSenderAddress?: null;
  safeTransferCheckFailed?: string;
  permitInvalidSignature?: null;
  permitExpired?: null;
  noncesError?: NoncesError;
}

export class PSP22ErrorBuilder {
  static Custom(value: string): PSP22Error {
    return {
      custom: value,
    };
  }
  static InsufficientBalance(): PSP22Error {
    return {
      insufficientBalance: null,
    };
  }
  static InsufficientAllowance(): PSP22Error {
    return {
      insufficientAllowance: null,
    };
  }
  static ZeroRecipientAddress(): PSP22Error {
    return {
      zeroRecipientAddress: null,
    };
  }
  static ZeroSenderAddress(): PSP22Error {
    return {
      zeroSenderAddress: null,
    };
  }
  static SafeTransferCheckFailed(value: string): PSP22Error {
    return {
      safeTransferCheckFailed: value,
    };
  }
  static PermitInvalidSignature(): PSP22Error {
    return {
      permitInvalidSignature: null,
    };
  }
  static PermitExpired(): PSP22Error {
    return {
      permitExpired: null,
    };
  }
  static NoncesError(value: NoncesError): PSP22Error {
    return {
      noncesError: value,
    };
  }
}

export interface NoncesError {
  invalidAccountNonce?: AccountId;
  nonceOverflow?: null;
}

export class NoncesErrorBuilder {
  static InvalidAccountNonce(value: AccountId): NoncesError {
    return {
      invalidAccountNonce: value,
    };
  }
  static NonceOverflow(): NoncesError {
    return {
      nonceOverflow: null,
    };
  }
}
