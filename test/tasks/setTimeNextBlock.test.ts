// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../../src/helpers";

import tasksHelper from "./helpers";

describe("setTimeNextBlock task tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    tasksHelper.useEnvironment("hardhat-project");
    // We need to receive difference because we do not know the current date, and that could be problematic
    // We do the sum IN the test
    function checkSetTimeNextBlock(difference: number) {
      it("DOES NOT mine a block and sets the exact time for the next block", async function () {
        const startBlock = await getLastBlock(this.hre);
        const setDate = parseInt(startBlock.timestamp, 16) + difference;
        await tasksHelper.setTimeNextBlock(setDate);
        const intermmediateBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16)).to.equal(
          parseInt(intermmediateBlock.number, 16)
        );
        await tasksHelper.mine(1);
        const endBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16) + 1).to.equal(
          parseInt(endBlock.number, 16)
        );
        return expect(parseInt(endBlock.timestamp, 16)).to.equal(setDate);
      });
    }

    checkSetTimeNextBlock(1);
    checkSetTimeNextBlock(10);
    checkSetTimeNextBlock(1000);
    checkSetTimeNextBlock(10000);

    it("fails if called with a passed date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = parseInt(latestBlock.timestamp, 16) - 1;
      return expect(() => tasksHelper.setTimeNextBlock(nextTimestamp)).to.throw;
    });

    it("only counts the last call", async function () {
      const startBlock = await getLastBlock(this.hre);
      const currentDate = parseInt(startBlock.timestamp, 16);
      const finalDate = currentDate + 10;
      await tasksHelper.setTimeNextBlock(finalDate + 100000);
      await tasksHelper.setTimeNextBlock(finalDate);
      await tasksHelper.mine(1);
      const endBlock = await getLastBlock(this.hre);

      return expect(parseInt(endBlock.timestamp, 16)).to.equal(finalDate);
    });
  });
});
