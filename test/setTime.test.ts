// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../src/helpers";

import { useEnvironment } from "./helpers";

describe("setTime tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    function checkSetTime(date: number) {
      it("mines a block and sets the exact time", async function () {
        const startBlock = await getLastBlock(this.hre);
        await this.hre.timeAndMine.setTime(date);
        const endBlock = await getLastBlock(this.hre);

        expect(parseInt(startBlock.number, 16) + 1).to.equal(
          parseInt(endBlock.number, 16)
        );
        return expect(parseInt(endBlock.timestamp, 16)).to.equal(date);
      });
    }

    checkSetTime(new Date().getTime());
    checkSetTime(new Date().getTime() + 10);
    checkSetTime(new Date().getTime() + 1000);
    checkSetTime(new Date().getTime() + 10000);

    it("fails if called with a passed date", async function () {
      const latestBlock = await getLastBlock(this.hre);
      const nextTimestamp = parseInt(latestBlock.timestamp, 16) - 1;
      return expect(this.hre.timeAndMine.setTime(nextTimestamp)).to.be.rejected;
    });
  });
});
