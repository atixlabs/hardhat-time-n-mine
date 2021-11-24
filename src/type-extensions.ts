import "hardhat/types/runtime";

import "./time-and-mine";

export type Dateish = string | number | Date;

declare module "hardhat/types/runtime" {
  // This is an example of an extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    timeAndMine: {
      increaseTime: (delta: string) => Promise<void>;
      setTimeIncrease: (delta: string) => Promise<void>;
      mine: (amount: number) => Promise<void>;
      setTime: (time: Dateish) => Promise<void>;
      setTimeNextBlock: (time: Dateish) => Promise<void>;
    };
  }
}
