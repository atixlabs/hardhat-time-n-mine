import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getLastBlock } from "./helpers";

const mineOneBlock = async (hre: HardhatRuntimeEnvironment) =>
  hre.network.provider.send("evm_mine", []);

const mineChunk = async (hre: HardhatRuntimeEnvironment, amount: number) =>
  Promise.all(
    Array.from({ length: amount }, () => mineOneBlock(hre))
  ) as unknown as Promise<void>;

const mine = (hre: HardhatRuntimeEnvironment) => async (amount: number) => {
  if (amount < 0)
    throw new Error("mine cannot be called wiht a negative value");
  const MAX_PARALLEL_CALLS = 1000;
  // Do it on parallel but do not overflow connections
  for (let i = 0; i < Math.floor(amount / MAX_PARALLEL_CALLS); i++) {
    await mineChunk(hre, MAX_PARALLEL_CALLS);
  }
  return mineChunk(hre, amount % MAX_PARALLEL_CALLS);
};

const increaseTime =
  (hre: HardhatRuntimeEnvironment) => async (delta: number) => {
    if (delta < 0)
      throw new Error("increaseTime cannot be called wiht a negative value");
    return hre.network.provider.send("evm_increaseTime", [delta]);
  };

const setTimeIncrease =
  (hre: HardhatRuntimeEnvironment) => async (delta: number) => {
    const latestBlock = await getLastBlock(hre);
    const nextTimestamp = parseInt(latestBlock.timestamp, 16) + delta;
    await setTimeNextBlock(hre)(nextTimestamp);
  };

const setTime = (hre: HardhatRuntimeEnvironment) => (time: number) =>
  hre.network.provider.send("evm_mine", [time]) as Promise<void>;

const setTimeNextBlock = (hre: HardhatRuntimeEnvironment) => (time: number) =>
  hre.network.provider.send("evm_setNextBlockTimestamp", [
    time,
  ]) as Promise<void>;

export default (
  hre: HardhatRuntimeEnvironment
): {
  increaseTime: (delta: number) => Promise<void>;
  setTimeIncrease: (delta: number) => Promise<void>;
  mine: (amount: number) => Promise<void>;
  setTime: (time: number) => Promise<void>;
  setTimeNextBlock: (time: number) => Promise<void>;
} => ({
  increaseTime: increaseTime(hre),
  setTimeIncrease: setTimeIncrease(hre),
  mine: mine(hre),
  setTime: setTime(hre),
  setTimeNextBlock: setTimeNextBlock(hre),
});
