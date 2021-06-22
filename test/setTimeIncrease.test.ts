// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../src/helpers";

import { useEnvironment } from "./helpers";

describe("setTimeIncrease tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    function checkSetTimeIncrease(delta: number) {
      it("setTimeIncrease DOES NOT mines a block and sets the exact time for the next block so that the difference with the current is the given parameter", async function () {
        const startBlock = await getLastBlock(this.hre);
        await this.hre.timeAndMine.setTimeIncrease(delta);
        const intermmediateBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16)).to.equal(
          parseInt(intermmediateBlock.number, 16)
        );
        await this.hre.timeAndMine.mine(1);
        const endBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16) + 1).to.equal(
          parseInt(endBlock.number, 16)
        );
        return expect(parseInt(startBlock.timestamp, 16) + delta).to.equal(
          parseInt(endBlock.timestamp, 16)
        );
      });
    }

    checkSetTimeIncrease(1);
    checkSetTimeIncrease(10);
    checkSetTimeIncrease(1000);
    checkSetTimeIncrease(10000);

    it("fails if called with a negative delta", async function () {
      return expect(this.hre.timeAndMine.setTimeIncrease(-1)).to.be.rejected;
    });

    it("is idempotent", async function () {
      const delta = 30;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.setTimeIncrease(delta);
      await this.hre.timeAndMine.setTimeIncrease(delta);
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(startBlock.timestamp, 16) + delta).to.be.equal(
        parseInt(endBlock.timestamp, 16)
      );
    });

    it("does not take into account real time passing", async function () {
      const delta = 30;
      const realTimeDelta = 1;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.setTimeIncrease(delta);
      const passingTimePromise: Promise<void> = new Promise((resolve) =>
        setTimeout(() => resolve(), realTimeDelta * 1000)
      );
      await passingTimePromise;
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(parseInt(startBlock.timestamp, 16) + delta).to.be.equal(
        parseInt(endBlock.timestamp, 16)
      );
    });
  });
});
