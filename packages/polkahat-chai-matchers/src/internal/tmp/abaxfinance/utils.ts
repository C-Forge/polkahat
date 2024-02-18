import type { ApiPromise } from "@polkadot/api";
import type { WeightV1, WeightV2 } from "@polkadot/types/interfaces";
import { WeightAll } from "@polkadot/api-contract/types";
import BN from "bn.js";
import { bnToBn } from "@polkadot/util";
export enum LangError {
  couldNotReadInput = "CouldNotReadInput",
}
export async function getApiAt(api: ApiPromise, blockNumber: number) {
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
  const apiAt = await api.at(blockHash);
  return apiAt;
}

export function convertWeight(
  weight: WeightV1 | WeightV2 | bigint | string | number | BN
): WeightAll {
  const [refTime, proofSize] = isWeightV2(weight)
    ? [weight.refTime.toBn(), weight.proofSize.toBn()]
    : [bnToBn(weight), undefined];

  return {
    v1Weight: refTime,
    v2Weight: { proofSize, refTime },
  };
}
export function isWeightV2(
  weight: WeightV1 | WeightV2 | bigint | string | number | BN
): weight is WeightV2 {
  return !!(weight as WeightV2).proofSize;
}

export const ONE_DAY = new BN(24 * 60 * 60 * 1000);
export const ONE_YEAR = ONE_DAY.mul(new BN(365));
export const MAX_U128 = "340282366920938463463374607431768211455";
