// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "../../src/helpers";
import { Dateish } from "../type-extensions";

import tasksHelper from "./helpers";

async function checkSetTime(
  hre: HardhatRuntimeEnvironment,
  numberToTime: (timestamp: number) => Dateish,
  delta: number
) {
  const startBlock = await getLastBlock(hre);
  const setDate = parseInt(startBlock.timestamp, 16) + delta;
  await tasksHelper.setTime(numberToTime(setDate));
  const endBlock = await getLastBlock(hre);

  expect(parseInt(startBlock.number, 16) + 1).to.equal(
    parseInt(endBlock.number, 16)
  );

  return expect(parseInt(endBlock.timestamp, 16)).to.equal(setDate);
}

describe.only("setTime task tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    tasksHelper.useEnvironment("hardhat-project");
    // We need to receive difference because we do not know the current date, and that could be problematic
    // We do the sum IN the test

    function checkSetTimeMultipleFormats(delta: number) {
      it("mines a block and sets the exact time using a number", async function () {
        return checkSetTime(this.hre, (timestamp: number) => timestamp, delta);
      });

      it("mines a block and sets the exact time using a string date", async function () {
        return checkSetTime(
          this.hre,
          (timestamp: number) => new Date(timestamp * 1000).toISOString(),
          delta
        );
      });

      it("mines a block and sets the exact time using a Date", async function () {
        return checkSetTime(
          this.hre,
          (timestamp: number) => new Date(timestamp * 1000),
          delta
        );
      });
    }

    checkSetTimeMultipleFormats(1);
    checkSetTimeMultipleFormats(10);
    checkSetTimeMultipleFormats(1000);
    checkSetTimeMultipleFormats(10000);

    it("fails if called with a passed date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = parseInt(latestBlock.timestamp, 16) - 1;
      return expect(tasksHelper.setTime(nextTimestamp)).to.be.rejected;
    });
  });
});
