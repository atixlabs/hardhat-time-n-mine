// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";

import { getLastBlock } from "../../src/helpers";

import tasksHelper from "./helpers";

describe("Mine task tests", function () {
  describe("Hardhat Runtime Environment extension", function () {
    tasksHelper.useEnvironment("hardhat-project");

    function checkMine(amount: number) {
      it(`mines ${amount} empty blocks when called with ${amount} as a parameter`, async function () {
        const startBlock = await getLastBlock(this.hre);
        await tasksHelper.mine(amount);
        const endBlock = await getLastBlock(this.hre);

        return expect(parseInt(startBlock.number, 16) + amount).to.equal(
          parseInt(endBlock.number, 16)
        );
      });
    }

    checkMine(0);
    checkMine(1);
    checkMine(2);
    checkMine(3300);

    it("fails if called with a negative value", function () {
      return expect(tasksHelper.mine(-10)).to.be.rejected;
    });
  });
});
