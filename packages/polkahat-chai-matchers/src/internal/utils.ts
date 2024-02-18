import type OrdinalT from "ordinal";

import { AssertWithSsfi, Ssfi } from "../utils";
import { PREVIOUS_MATCHER_NAME } from "./constants";
import {
  PolkahatChaiMatchersAssertionError,
  PolkahatChaiMatchersNonChainableMatcherError,
} from "./errors";

export function assertIsNotNull<T>(
  value: T,
  valueName: string
): asserts value is Exclude<T, null> {
  if (value === null) {
    throw new PolkahatChaiMatchersAssertionError(
      `${valueName} should not be null`
    );
  }
}

export function preventAsyncMatcherChaining(
  context: object,
  matcherName: string,
  chaiUtils: Chai.ChaiUtils,
  allowSelfChaining: boolean = false
) {
  const previousMatcherName: string | undefined = chaiUtils.flag(
    context,
    PREVIOUS_MATCHER_NAME
  );

  if (previousMatcherName === undefined) {
    chaiUtils.flag(context, PREVIOUS_MATCHER_NAME, matcherName);
    return;
  }

  if (previousMatcherName === matcherName && allowSelfChaining) {
    return;
  }

  throw new PolkahatChaiMatchersNonChainableMatcherError(
    matcherName,
    previousMatcherName
  );
}

export function assertArgsArraysEqual(
  Assertion: Chai.AssertionStatic,
  expectedArgs: any[],
  actualArgs: any[],
  tag: string,
  assertionType: "event" | "error",
  assert: AssertWithSsfi,
  ssfi: Ssfi
) {
  try {
    innerAssertArgsArraysEqual(
      Assertion,
      expectedArgs,
      actualArgs,
      assertionType,
      assert,
      ssfi
    );
  } catch (err: any) {
    err.message = `Error in ${tag}: ${err.message}`;
    throw err;
  }
}

function innerAssertArgsArraysEqual(
  Assertion: Chai.AssertionStatic,
  expectedArgs: any[],
  actualArgs: any[],
  assertionType: "event" | "error",
  assert: AssertWithSsfi,
  ssfi: Ssfi
) {
  assert(
    actualArgs.length === expectedArgs.length,
    `Expected arguments array to have length ${expectedArgs.length}, but it has ${actualArgs.length}`
  );
  for (const [index, expectedArg] of expectedArgs.entries()) {
    try {
      innerAssertArgEqual(
        Assertion,
        expectedArg,
        actualArgs[index],
        assertionType,
        assert,
        ssfi
      );
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ordinal = require("ordinal") as typeof OrdinalT;
      err.message = `Error in the ${ordinal(index + 1)} argument assertion: ${
        err.message
      }`;
      throw err;
    }
  }
}

function innerAssertArgEqual(
  Assertion: Chai.AssertionStatic,
  expectedArg: any,
  actualArg: any,
  assertionType: "event" | "error",
  assert: AssertWithSsfi,
  ssfi: Ssfi
) {
  if (typeof expectedArg === "function") {
    try {
      if (expectedArg(actualArg) === true) return;
    } catch (e: any) {
      assert(false, `The predicate threw when called: ${e.message}`);
    }
    assert(false, `The predicate did not return true`);
  } else if (expectedArg instanceof Uint8Array) {
    new Assertion(actualArg, undefined, ssfi, true).equal(
      "todo" //ethers.hexlify(expectedArg)
    );
  } else if (
    expectedArg?.length !== undefined &&
    typeof expectedArg !== "string"
  ) {
    innerAssertArgsArraysEqual(
      Assertion,
      expectedArg,
      actualArg,
      assertionType,
      assert,
      ssfi
    );
  } else {
    new Assertion(actualArg, undefined, ssfi, true).equal(expectedArg);
  }
}
