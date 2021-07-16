// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../../src/helpers";

import { useEnvironment } from "./helpers";

describe("setTimeIncrease tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    function checkSetTimeIncrease(
      delta: string,
      expectedDeltaInSeconds: number
    ) {
      it(`setTimeIncrease DOES NOT mine a block and sets the exact time for the next block so that the difference with the current is ${delta}`, async function () {
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
        return expect(
          parseInt(startBlock.timestamp, 16) + expectedDeltaInSeconds
        ).to.equal(parseInt(endBlock.timestamp, 16));
      });
    }

    checkSetTimeIncrease("1", 1);
    checkSetTimeIncrease("10", 10);
    checkSetTimeIncrease("1000", 1000);
    checkSetTimeIncrease("10000", 10000);
    checkSetTimeIncrease("1s", 1);
    checkSetTimeIncrease("1day", 60 * 60 * 24);
    checkSetTimeIncrease("1d", 60 * 60 * 24);
    checkSetTimeIncrease("1 week", 60 * 60 * 24 * 7);

    it("fails if called with a negative delta", async function () {
      return expect(this.hre.timeAndMine.setTimeIncrease("-1")).to.be.rejected;
    });

    it("is idempotent", async function () {
      const delta = "30";
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.setTimeIncrease(delta);
      await this.hre.timeAndMine.setTimeIncrease(delta);
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(
        parseInt(startBlock.timestamp, 16) + parseInt(delta, 10)
      ).to.be.equal(parseInt(endBlock.timestamp, 16));
    });

    it("does not take into account real time passing", async function () {
      const delta = "30";
      const realTimeDelta = 1;
      const startBlock = await getLastBlock(this.hre);
      await this.hre.timeAndMine.setTimeIncrease(delta);
      const passingTimePromise: Promise<void> = new Promise((resolve) =>
        setTimeout(() => resolve(), realTimeDelta * 1000)
      );
      await passingTimePromise;
      await this.hre.timeAndMine.mine(1);
      const endBlock = await getLastBlock(this.hre);
      return expect(
        parseInt(startBlock.timestamp, 16) + parseInt(delta, 10)
      ).to.be.equal(parseInt(endBlock.timestamp, 16));
    });

    it("fails if called with a negative value", function () {
      return expect(this.hre.timeAndMine.setTimeIncrease("-10000")).to.be
        .rejected;
    });
    it("fails if called with a non integer value", function () {
      return expect(this.hre.timeAndMine.setTimeIncrease("10000.3")).to.be
        .rejected;
    });
  });
});
