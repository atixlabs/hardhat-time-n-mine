import { extendEnvironment, task, types } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";

import timeAndMine from "./time-and-mine";

extendEnvironment(
  (hre) => (hre.timeAndMine = lazyObject(() => timeAndMine(hre)))
);

task("mine")
  .setDescription("mines a single block")
  .addOptionalParam("amount", "amount of blocks to be mined", 1, types.int)
  .setAction((args, hre) => hre.timeAndMine.mine(args.amount));

task("setTime")
  .setDescription(
    "mines a single block with a given time, effectively setting the time of the blockchain"
  )
  .addPositionalParam(
    "time",
    "timestamp of the next block",
    undefined,
    types.int,
    false
  )
  .setAction((args, hre) => hre.timeAndMine.setTime(args.time));

task("setTimeIncrease")
  .setDescription(
    "makes the next block timestamp increase the given delta with respect to the current block timestamp"
  )
  .addPositionalParam(
    "delta",
    "difference between the current timestamp and the next. Can be a number representing the seconds or a string representing the delta",
    undefined,
    types.string,
    false
  )
  .setAction((args, hre) => hre.timeAndMine.setTimeIncrease(args.delta));

task("increaseTime")
  .setDescription(
    "adds the given delta. NOTICE: this counts 'real' ellapsing time and is not idempotent, we recommend you user setTimeIncrease"
  )
  .addPositionalParam(
    "delta",
    "difference to add to the current time tracker. Can be a number representing the seconds or a string representing the delta",
    undefined,
    types.string,
    false
  )
  .setAction((args, hre) => hre.timeAndMine.increaseTime(args.delta));

task("setTimeNextBlock")
  .setDescription("set the timestamp of the next block(does not actually mine)")
  .addPositionalParam(
    "time",
    "timestamp of the next block",
    undefined,
    types.int,
    false
  )
  .setAction((args, hre) => hre.timeAndMine.setTimeNextBlock(args.time));
