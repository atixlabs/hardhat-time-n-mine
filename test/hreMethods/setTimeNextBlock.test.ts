// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "../../src/helpers";
import { Dateish } from "../type-extensions";

import { useEnvironment } from "./helpers";

async function checkSetTimeNextBlock(
  hre: HardhatRuntimeEnvironment,
  numberToTime: (timestamp: number) => Dateish,
  delta: number
) {
  const startBlock = await getLastBlock(hre);
  const startTime = parseInt(startBlock.timestamp, 16);
  const targetTime = startTime + delta;

  await hre.timeAndMine.setTimeNextBlock(numberToTime(targetTime));
  const intermmediateBlock = await getLastBlock(hre);

  expect(parseInt(startBlock.number, 16)).to.equal(
    parseInt(intermmediateBlock.number, 16)
  );
  await hre.timeAndMine.mine(1);
  const endBlock = await getLastBlock(hre);

  expect(parseInt(startBlock.number, 16) + 1).to.equal(
    parseInt(endBlock.number, 16)
  );
  return expect(parseInt(endBlock.timestamp, 16)).to.equal(targetTime);
}

describe("setTimeNextBlock tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    function checkSetTimeNextBlockMultipleFormats(delta: number) {
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

    checkSetTimeNextBlockMultipleFormats(1);
    checkSetTimeNextBlockMultipleFormats(10);
    checkSetTimeNextBlockMultipleFormats(1000);
    checkSetTimeNextBlockMultipleFormats(10000);

    it("fails if called with a passed date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = parseInt(latestBlock.timestamp, 16) - 1;
      return expect(() => this.hre.timeAndMine.setTimeNextBlock(nextTimestamp))
        .to.throw;
    });

    it("only counts the last call", async function () {
      const startBlock = await getLastBlock(this.hre);
      const currentDate = new Date().getTime();
      const finalDate = currentDate + 10;
      await this.hre.timeAndMine.setTimeNextBlock(finalDate + 100000);
      await this.hre.timeAndMine.setTimeNextBlock(finalDate);
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);

      return expect(parseInt(endBlock.timestamp, 16)).to.equal(finalDate);
    });
  });
});
