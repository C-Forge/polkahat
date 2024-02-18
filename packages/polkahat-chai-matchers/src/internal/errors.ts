// // import { PolkahatPluginError } from "hardhat/plugins";

// export class PolkahatChaiMatchersError extends PolkahatPluginError {
//   constructor(message: string, parent?: Error) {
//     super("wookashwackomytest-polkahat-chai-matchers", message, parent);
//   }
// }

// export class PolkahatChaiMatchersDecodingError extends PolkahatChaiMatchersError {
//   constructor(encodedData: string, type: string, parent: Error) {
//     const message = `There was an error decoding '${encodedData}' as a ${type}`;

//     super(message, parent);
//   }
// }

// /**
//  * This class is used to assert assumptions in our implementation. Chai's
//  * AssertionError should be used for user assertions.
//  */
// export class PolkahatChaiMatchersAssertionError extends PolkahatChaiMatchersError {
//   constructor(message: string) {
//     super(`Assertion error: ${message}`);
//   }
// }

// export class PolkahatChaiMatchersNonChainableMatcherError extends PolkahatChaiMatchersError {
//   constructor(matcherName: string, previousMatcherName: string) {
//     super(
//       `The matcher '${matcherName}' cannot be chained after '${previousMatcherName}'. For more information, please refer to the documentation at: https://hardhat.org/chaining-async-matchers.`
//     );
//   }
// }

export class PolkahatChaiMatchersAssertionError extends Error {
  constructor(message: string) {
    super(`Assertion error: ${message}`);
  }
}

export class PolkahatChaiMatchersNonChainableMatcherError extends Error {
  constructor(matcherName: string, previousMatcherName: string) {
    super(
      `The matcher '${matcherName}' cannot be chained after '${previousMatcherName}'.`
    );
  }
}
