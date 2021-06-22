// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../src/helpers";

import { useEnvironment } from "./helpers";

describe("setTimeNextBlock tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    function checkSetTimeNextBlock(date: number) {
      it("DOES NOT mines a block and sets the exact time for the next block", async function () {
        const startBlock = await getLastBlock(this.hre);
        await this.hre.timeAndMine.setTimeNextBlock(date);
        const intermmediateBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16)).to.equal(
          parseInt(intermmediateBlock.number, 16)
        );
        await this.hre.timeAndMine.mine(1);
        const endBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16) + 1).to.equal(
          parseInt(endBlock.number, 16)
        );
        return expect(parseInt(endBlock.timestamp, 16)).to.equal(date);
      });
    }

    checkSetTimeNextBlock(new Date().getTime());
    checkSetTimeNextBlock(new Date().getTime() + 10);
    checkSetTimeNextBlock(new Date().getTime() + 1000);
    checkSetTimeNextBlock(new Date().getTime() + 10000);

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
