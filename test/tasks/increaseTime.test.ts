// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "../../src/helpers";

import tasksHelper from "./helpers";

describe("increaseTime task tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    tasksHelper.useEnvironment("hardhat-project");
    async function expectTimeIncrease(
      hre: HardhatRuntimeEnvironment,
      startingTimestamp: number,
      delta: number
    ) {
      // We must allow some wiggle room because increaseTime counts real elapsing time, so we must
      // assume that sometime can pass(we do not put an upper limit, because these tests are slow)
      const endBlock = await getLastBlock(hre);

      expect(startingTimestamp + delta).to.be.greaterThanOrEqual(
        parseInt(endBlock.timestamp, 16)
      );
    }
    it("if increaseTime is called twice, both calls count", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await tasksHelper.increaseTime(delta);
      await tasksHelper.increaseTime(delta);
      await tasksHelper.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(endBlock.timestamp, 16)).to.be.greaterThanOrEqual(
        parseInt(startBlock.timestamp, 16) + delta * 2
      );
    });

    it("if increaseTime is called once with a delta that amount is incremented", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await tasksHelper.increaseTime(delta);
      await tasksHelper.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(endBlock.timestamp, 16)).to.be.greaterThanOrEqual(
        parseInt(startBlock.timestamp, 16) + delta
      );
    });

    it("if increaseTime is called and real time ellapses both amounts count", async function () {
      const delta = 30;
      const realTimeDelta = 2;
      const startBlock = await getLastBlock(this.hre);
      await tasksHelper.increaseTime(delta);
      const passingTimePromise: Promise<void> = new Promise((resolve) =>
        setTimeout(() => resolve(), realTimeDelta * 1000)
      );
      await passingTimePromise;
      await tasksHelper.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(endBlock.timestamp, 16)).to.be.greaterThanOrEqual(
        parseInt(startBlock.timestamp, 16) + delta + realTimeDelta
      );
    });

    it("fails if called with a negative value", function () {
      return expect(tasksHelper.increaseTime(-10000)).to.be.rejected;
    });
  });
});
