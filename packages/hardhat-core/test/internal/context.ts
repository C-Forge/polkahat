import { assert } from "chai";

import { HardhatContext } from "../../src/internal/context";
import { ERRORS } from "../../src/internal/core/errors-list";
import { resetHardhatContext } from "../../src/internal/reset";
import { useEnvironment } from "../helpers/environment";
import { expectPolkahatError } from "../helpers/errors";
import { useFixtureProject } from "../helpers/project";

describe("Hardhat context", async function () {
  describe("no context", () => {
    it("context is not defined", async function () {
      assert.isFalse(HardhatContext.isCreated());
    });

    it("should throw when context isn't created", async function () {
      expectPolkahatError(
        () => HardhatContext.getHardhatContext(),
        ERRORS.GENERAL.CONTEXT_NOT_CREATED
      );
    });
  });

  describe("create context but no environment", async function () {
    afterEach("reset context", function () {
      resetHardhatContext();
    });

    it("context is defined", async function () {
      HardhatContext.createHardhatContext();
      assert.isTrue(HardhatContext.isCreated());
    });

    it("context initialize properly", async function () {
      const ctx = HardhatContext.createHardhatContext();
      assert.isDefined(ctx.environmentExtenders);
      assert.isDefined(ctx.tasksDSL);
      assert.isUndefined(ctx.environment);
    });

    it("should throw when recreating hardhat context", async function () {
      HardhatContext.createHardhatContext();
      expectPolkahatError(
        () => HardhatContext.createHardhatContext(),
        ERRORS.GENERAL.CONTEXT_ALREADY_CREATED
      );
    });

    it("should delete context", async function () {
      assert.isFalse(HardhatContext.isCreated());
      HardhatContext.createHardhatContext();
      assert.isTrue(HardhatContext.isCreated());
      HardhatContext.deleteHardhatContext();
      assert.isFalse(HardhatContext.isCreated());
    });

    it("should throw when HRE is not defined", async function () {
      const ctx = HardhatContext.createHardhatContext();
      expectPolkahatError(
        () => ctx.getHardhatRuntimeEnvironment(),
        ERRORS.GENERAL.CONTEXT_HRE_NOT_DEFINED
      );
    });
  });

  describe("environment creates context", async function () {
    useFixtureProject("config-project");
    useEnvironment();
    it("should create context and set HRE into context", async function () {
      assert.equal(
        HardhatContext.getHardhatContext().getHardhatRuntimeEnvironment(),
        this.env
      );
    });
    it("should throw when trying to set HRE", async function () {
      expectPolkahatError(
        () =>
          HardhatContext.getHardhatContext().setHardhatRuntimeEnvironment(
            this.env
          ),
        ERRORS.GENERAL.CONTEXT_HRE_ALREADY_DEFINED
      );
    });
  });
});
