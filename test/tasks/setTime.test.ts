// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../../src/helpers";

import tasksHelper from "./helpers";

describe("setTime task tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    tasksHelper.useEnvironment("hardhat-project");
    // We need to receive difference because we do not know the current date, and that could be problematic
    // We do the sum IN the test
    function checkSetTime(difference: number) {
      it("mines a block and sets the exact time", async function () {
        const startBlock = await getLastBlock(this.hre);
        const setDate = parseInt(startBlock.timestamp, 16) + difference;
        await tasksHelper.setTime(setDate);
        const endBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16) + 1).to.equal(
          parseInt(endBlock.number, 16)
        );
        return expect(parseInt(endBlock.timestamp, 16)).to.equal(setDate);
      });
    }

    checkSetTime(1);
    checkSetTime(10);
    checkSetTime(1000);
    checkSetTime(10000);

    it("fails if called with a passed date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = parseInt(latestBlock.timestamp, 16) - 1;
      return expect(tasksHelper.setTime(nextTimestamp)).to.be.rejected;
    });
  });
});
