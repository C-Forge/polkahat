import { QueryReturnType, Result } from "wookashwackomytest-typechain-types";
import { REVERTED_WITH_ERROR_MATCHER } from "../constants";
import { preventAsyncMatcherChaining } from "../utils";
import { LangError } from "../tmp/abaxfinance/utils";

async function verifyRevertedWithCustomError(
  this: Chai.AssertionPrototype,
  expectedError: { [key: string]: any }
): Promise<void> {
  let queryRes: QueryReturnType<Result<Result<unknown, unknown>, LangError>>;
  const maybeQuery:
    | QueryReturnType<Result<Result<unknown, unknown>, LangError>>
    | Promise<QueryReturnType<Result<Result<unknown, unknown>, LangError>>> =
    this._obj;

  if (maybeQuery instanceof Promise) {
    queryRes = await maybeQuery;
  } else {
    queryRes = maybeQuery;
  }
  if (queryRes.value.err) {
    throw new Error("query failed hard");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = queryRes.value.ok!;
  this.assert(
    result.err !== undefined,
    `expected to revert with error ${JSON.stringify(
      expectedError,
      null,
      2
    )} but succeeded`,
    `expected not to revert with error ${JSON.stringify(
      expectedError,
      null,
      2
    )} but got ${result.err}`,
    JSON.stringify(expectedError, null, 2),
    result.err
  );
  const expectedName = Object.keys(expectedError)[0];
  const expectedValue = expectedError[expectedName];

  const actualName = Object.keys(result.err as any)[0];
  const actualValue = (result.err as any)[actualName];
  this.assert(
    actualName === expectedName && actualValue === expectedValue,
    `expected to revert with error ${JSON.stringify(
      expectedError,
      null,
      2
    )} but got ${JSON.stringify(result.err, null, 2)}`,
    `expected not to revert with error ${JSON.stringify(
      expectedError,
      null,
      2
    )} but got ${JSON.stringify(result.err, null, 2)}`,
    JSON.stringify(expectedError, null, 2),
    JSON.stringify(result.err, null, 2)
  );
}

export function supportRevertedWithError(
  Assertion: Chai.AssertionStatic,
  chaiUtils: Chai.ChaiUtils
) {
  Assertion.addMethod(
    REVERTED_WITH_ERROR_MATCHER,
    function (this: any, error: { [key: string]: any }) {
      // // capture negated flag before async code executes; see buildAssert's jsdoc
      // const negated = this.__flags.negate;

      preventAsyncMatcherChaining(this, REVERTED_WITH_ERROR_MATCHER, chaiUtils);

      const derivedPromise = verifyRevertedWithCustomError.apply(this, [error]);
      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);
      return this;
    }
  );
}
