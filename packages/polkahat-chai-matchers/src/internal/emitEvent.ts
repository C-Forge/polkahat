import BN from "bn.js";
import { PSP22 } from "./tmp/PSP22.type";
import { decodeEvents } from "./tmp/typechain/utils";
import { replaceNumericPropsWithStrings } from "./tmp/abaxfinance/contract-helpers";
import { SignAndSendSuccessResponse } from "wookashwackomytest-typechain-types";
import { EMIT_EVENT_MATCHER } from "./constants";
import { preventAsyncMatcherChaining } from "./utils";

async function emitEvent(
  this: Chai.AssertionPrototype,
  contractArg: any,
  eventName: string,
  args?: Record<string, string | number | BN>
) {
  const contract = contractArg as PSP22;
  let tx: SignAndSendSuccessResponse;
  const maybeTx:
    | SignAndSendSuccessResponse
    | Promise<SignAndSendSuccessResponse> = this._obj;

  if (maybeTx instanceof Promise) {
    tx = await maybeTx;
  } else {
    tx = maybeTx;
  }
  if (!tx.result) {
    throw new Error("tx result is undefined");
  }
  const events = tx.result.events;
  const eventsDecoded = decodeEvents(
    events,
    contract.nativeContract,
    contract.eventDataTypeDescriptions
  );
  //assert event with given name was emitted
  const eventsDecodedWithName = eventsDecoded.filter(
    (e) => e.name === eventName
  );
  this.assert(
    eventsDecodedWithName.length > 0,
    `expected event ${eventName} to be emitted`,
    `expected event ${eventName} not to be emitted`,
    null,
    JSON.stringify(eventsDecoded)
  );

  //validate args
  if (!args) return;

  if (eventsDecodedWithName.length === 1) {
    //assert event has expected args
    const expectedArgs = Object.entries(args);
    for (const [key, value] of expectedArgs) {
      //check whether the event has the arg key
      this.assert(
        eventsDecodedWithName[0].args[key] !== undefined,
        `expected event ${eventName} to have arg ${key}`,
        `expected event ${eventName} not to have arg ${key}`,
        null,
        eventsDecodedWithName[0].args
      );
      this.assert(
        eventsDecodedWithName[0].args[key].toString() ===
          (value as any).toString(), //TODO
        `expected event ${eventName} to have arg ${key} equal to ${value}. Found value: ${eventsDecodedWithName[0].args[
          key
        ].toString()}`,
        `expected event ${eventName} not to have arg ${key} equal to ${value}.`,
        value,
        eventsDecodedWithName[0].args[key].toString()
      );
    }
  } else {
    let foundEvent = false;
    for (const event of eventsDecodedWithName) {
      if (
        Object.entries(args).every(
          ([key, value]) =>
            event.args[key]?.toString() === (value as any).toString()
        )
      ) {
        foundEvent = true;
        break;
      }
    }
    if (!foundEvent) {
      this.assert(
        false,
        `expected to find event ${eventName} to have args ${JSON.stringify(
          args
        )}`,
        `expected not to event ${eventName} not to have args ${JSON.stringify(
          args
        )}`,
        null,
        replaceNumericPropsWithStrings(eventsDecodedWithName)
      );
    }
  }
}

export function supportEmitEvent(
  Assertion: Chai.AssertionStatic,
  chaiUtils: Chai.ChaiUtils
) {
  Assertion.addMethod(
    EMIT_EVENT_MATCHER,
    function (
      this: Chai.AssertionPrototype,
      contractArg: any,
      eventName: string,
      args?: Record<string, string | number | BN>
    ) {
      preventAsyncMatcherChaining(this, EMIT_EVENT_MATCHER, chaiUtils);

      const derivedPromise = emitEvent.apply(this, [
        contractArg,
        eventName,
        args,
      ]);
      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
