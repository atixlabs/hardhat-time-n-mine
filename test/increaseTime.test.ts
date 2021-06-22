// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../src/helpers";

import { useEnvironment } from "./helpers";
describe("increaseTime tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("if increaseTime is called twice, both calls count", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.increaseTime(delta);
      await this.hre.timeAndMine.increaseTime(delta);
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(startBlock.timestamp, 16) + delta * 2).to.be.equal(
        parseInt(endBlock.timestamp, 16)
      );
    });

    it("if increaseTime is called once with a delta that amount is incremented", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.increaseTime(delta);
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(startBlock.timestamp, 16) + delta).to.be.equal(
        parseInt(endBlock.timestamp, 16)
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
      const endBlock = await getLastBlock(this.hre);
      return expect(
        parseInt(startBlock.timestamp, 16) + delta + realTimeDelta
      ).to.be.equal(parseInt(endBlock.timestamp, 16));
    });

    it("fails if called with a negative value", function () {
      return expect(this.hre.timeAndMine.increaseTime(-10000)).to.be.rejected;
    });
  });
});
