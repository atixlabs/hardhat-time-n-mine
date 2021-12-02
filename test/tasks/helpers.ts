import { exec, ExecException } from "child_process";
import { resetHardhatContext } from "hardhat/plugins-testing";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";

import { Dateish } from "../type-extensions";

declare module "mocha" {
  interface Context {
    hre: HardhatRuntimeEnvironment;
  }
}

const executeTask = (taskName: string, parameter: string): Promise<void> =>
  new Promise((resolve, reject) =>
    exec(
      `npx hardhat --network localhost ${taskName} ${parameter}`,
      (err: ExecException | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    )
  );

const increaseTime = (delta: string) =>
  executeTask("increaseTime", `"${delta}"`);

const setTimeIncrease = (delta: string) =>
  executeTask("setTimeIncrease", `"${delta}"`);

const mine = (amount: number) => executeTask("mine", `--amount ${amount}`);

const setTime = (time: Dateish) =>
  executeTask("setTime", '"' + time.toString() + '"');

const setTimeNextBlock = (time: Dateish) =>
  executeTask("setTimeNextBlock", '"' + time.toString() + '"');

const useEnvironment = (fixtureProjectName: string) => {
  beforeEach("Loading hardhat environment", function () {
    process.chdir(path.join(__dirname, "fixture-projects", fixtureProjectName));

    this.hre = require("hardhat");
  });

  afterEach("Resetting hardhat", function () {
    resetHardhatContext();
  });
};

export default {
  increaseTime,
  setTimeIncrease,
  mine,
  setTime,
  setTimeNextBlock,
  useEnvironment,
};
