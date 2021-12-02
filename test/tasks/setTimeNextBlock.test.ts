// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "../../src/helpers";
import { Dateish } from "../type-extensions";

import tasksHelper from "./helpers";

async function checkSetTimeNextBlock(
  hre: HardhatRuntimeEnvironment,
  numberToTime: (timestamp: number) => Dateish,
  delta: number
) {
  const startBlock = await getLastBlock(hre);
  const setDate = parseInt(startBlock.timestamp, 16) + delta;
  await tasksHelper.setTimeNextBlock(numberToTime(setDate));
  const intermmediateBlock = await getLastBlock(hre);

  expect(parseInt(startBlock.number, 16)).to.equal(
    parseInt(intermmediateBlock.number, 16)
  );
  await tasksHelper.mine(1);
  const endBlock = await getLastBlock(hre);

  expect(parseInt(startBlock.number, 16) + 1).to.equal(
    parseInt(endBlock.number, 16)
  );
  return expect(parseInt(endBlock.timestamp, 16)).to.equal(setDate);
}

describe("setTimeNextBlock task tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    tasksHelper.useEnvironment("hardhat-project");
    // We need to receive difference because we do not know the current date, and that could be problematic
    // We do the sum IN the test

    function checkSetTimeNextMultipleFormats(delta: number) {
      it("DOES NOT mine a block and sets the exact time for the next block using a number", async function () {
        return checkSetTimeNextBlock(
          this.hre,
          (timestamp: number) => timestamp,
          delta
        );
      });

      it("DOES NOT mine a block and sets the exact time for the next block using a string date", async function () {
        return checkSetTimeNextBlock(
          this.hre,
          (timestamp: number) => new Date(timestamp * 1000).toISOString(),
          delta
        );
      });

      it("DOES NOT mine a block and sets the exact time for the next block using a Date", async function () {
        return checkSetTimeNextBlock(
          this.hre,
          (timestamp: number) => new Date(timestamp * 1000),
          delta
        );
      });
    }

    checkSetTimeNextMultipleFormats(1);
    checkSetTimeNextMultipleFormats(10);
    checkSetTimeNextMultipleFormats(1000);
    checkSetTimeNextMultipleFormats(10000);

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
