import { supportChangeTokenAllowances } from "./changeTokenAllowances";
import { supportChangeTokenBalances } from "./changeTokenBalances";
import { supportEmitEvent } from "./emitEvent";
import { supportRevertedWithError } from "./reverted/revertedWithError";

export function polkahatChaiMatchers(
  chai: Chai.ChaiStatic,
  chaiUtils: Chai.ChaiUtils
) {
  // supportBN(chai.Assertion, chaiUtils); //TODO
  supportEmitEvent(chai.Assertion, chaiUtils);
  // supportChangeNativeBalance(chai.Assertion, chaiUtils); //TODO
  // supportChangeNativeBalances(chai.Assertion, chaiUtils); //TODO
  // supportChangeTokenBalance(chai.Assertion, chaiUtils); //TODO
  supportChangeTokenBalances(chai.Assertion, chaiUtils);
  supportChangeTokenAllowances(chai.Assertion, chaiUtils);
  // supportReverted(chai.Assertion, chaiUtils); //TODO
  supportRevertedWithError(chai.Assertion, chaiUtils);
  // supportRevertedWithoutReason(chai.Assertion, chaiUtils); //TODO
}
