// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "../../src/helpers";

import { useEnvironment } from "./helpers";
describe("increaseTime tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");
    async function expectTimeIncrease(
      hre: HardhatRuntimeEnvironment,
      startingTimestamp: number,
      delta: number
    ) {
      // We must allow some wiggle room because increaseTime counts real elapsing time, so we must
      // assume that a second can pass(we assume that only a second pass since these tests are pretty fast)
      const endBlock = await getLastBlock(hre);

      expect(startingTimestamp + delta).to.be.greaterThanOrEqual(
        parseInt(endBlock.timestamp, 16)
      );
      return expect(startingTimestamp + delta).to.be.lessThanOrEqual(
        parseInt(endBlock.timestamp, 16) + 1
      );
    }
    it("if increaseTime is called twice, both calls count", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.increaseTime(delta);
      await this.hre.timeAndMine.increaseTime(delta);
      await this.hre.timeAndMine.mine(1);
      return expectTimeIncrease(
        this.hre,
        parseInt(startBlock.timestamp, 16),
        delta * 2
      );
    });

    it("if increaseTime is called once with a delta that amount is incremented", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.increaseTime(delta);
      await this.hre.timeAndMine.mine(1);
      return expectTimeIncrease(
        this.hre,
        parseInt(startBlock.timestamp, 16),
        delta
      );
    });

    it("if increaseTime is called and real time ellapses both amounts count", async function () {
      const delta = 30;
      const realTimeDelta = 2;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.increaseTime(delta);
      const passingTimePromise: Promise<void> = new Promise((resolve) =>
        setTimeout(() => resolve(), realTimeDelta * 1000)
      );
      await passingTimePromise;
      await this.hre.timeAndMine.mine(1);
      return expectTimeIncrease(
        this.hre,
        parseInt(startBlock.timestamp, 16),
        delta + realTimeDelta
      );
    });

    it("fails if called with a negative value", function () {
      return expect(this.hre.timeAndMine.increaseTime(-10000)).to.be.rejected;
    });
  });
});
