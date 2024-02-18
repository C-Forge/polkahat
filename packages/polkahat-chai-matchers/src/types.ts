// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Chai {
  interface Assertion
    extends LanguageChains,
      NumericComparison,
      TypeComparison {
    emitEvent(
      contract: any,
      eventName: string,
      args?: Record<string, string | number | import("bn.js")>
    ): AsyncAssertion;
    revertedWithError: (error: { [key: string]: any }) => AsyncAssertion;
    changeTokenAllowances: (
      token: any,
      ownerAndSpender: [string, string][],
      deltas: import("bn.js")[]
    ) => AsyncAssertion;
    // changeNativeBalance(
    //   account: any,
    //   balance: any,
    //   options?: any
    // ): AsyncAssertion;
    // changeNativeBalances(
    //   accounts: any[],
    //   balances: any[],
    //   options?: any
    // ): AsyncAssertion;
    // changeTokenBalance(token: any, account: any, balance: any): AsyncAssertion;
    changeTokenBalances(
      token: any,
      account: any[],
      balance: any[]
    ): AsyncAssertion;
  }

  // interface NumericComparison {
  //   within(start: any, finish: any, message?: string): Assertion;
  // }

  // interface NumberComparer {
  //   // eslint-disable-next-line
  //   (value: any, message?: string): Assertion;
  // }

  // interface CloseTo {
  //   // eslint-disable-next-line
  //   (expected: any, delta: any, message?: string): Assertion;
  // }

  // interface Length extends Assertion {
  //   // eslint-disable-next-line
  //   (length: any, message?: string): Assertion;
  // }

  interface AsyncAssertion extends Assertion, Promise<void> {}
}
