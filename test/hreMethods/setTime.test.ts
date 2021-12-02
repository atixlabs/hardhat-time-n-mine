// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "../../src/helpers";
import { Dateish } from "../type-extensions";

import { useEnvironment } from "./helpers";

async function checkSetTime(
  hre: HardhatRuntimeEnvironment,
  numberToTime: (timestamp: number) => Dateish,
  delta: number
) {
  const startBlock = await getLastBlock(hre);

  const startTime = parseInt(startBlock.timestamp, 16);
  const targetTime = startTime + delta;
  await hre.timeAndMine.setTime(numberToTime(targetTime));
  const endBlock = await getLastBlock(hre);

  expect(parseInt(startBlock.number, 16) + 1).to.equal(
    parseInt(endBlock.number, 16)
  );
  return expect(parseInt(endBlock.timestamp, 16)).to.equal(targetTime);
}

describe("setTime tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

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

    it("mines a block and sets the exact time using utc string", async function () {
      return checkSetTime(
        this.hre,
        (timestamp: number) => new Date(timestamp * 1000).toUTCString(),
        1
      );
    });

    it("mines a block and sets the exact time using a YYYY-MM-DD format", async function () {
      const startBlock = await getLastBlock(this.hre);

      await this.hre.timeAndMine.setTime("2050-10-14");
      const endBlock = await getLastBlock(this.hre);

      expect(parseInt(startBlock.number, 16) + 1).to.equal(
        parseInt(endBlock.number, 16)
      );
      return expect(parseInt(endBlock.timestamp, 16)).to.equal(2549318400); // Taken from online conversion tool
    });

    it("fails if called with a passed date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = parseInt(latestBlock.timestamp, 16) - 1;
      return expect(
        this.hre.timeAndMine.setTime(nextTimestamp)
      ).to.be.rejectedWith(" is lower than previous block's timestamp ");
    });

    it("fails if called with a passed date as a string", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = Math.floor(parseInt(latestBlock.timestamp, 16)) - 1;
      return expect(
        this.hre.timeAndMine.setTime(
          new Date(nextTimestamp * 1000).toISOString()
        )
      ).to.be.rejectedWith(" is lower than previous block's timestamp ");
    });

    it("fails if called with a passed date as a Date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = Math.floor(parseInt(latestBlock.timestamp, 16)) - 1;
      return expect(
        this.hre.timeAndMine.setTime(new Date(nextTimestamp * 1000))
      ).to.be.rejectedWith(" is lower than previous block's timestamp ");
    });
  });
});
