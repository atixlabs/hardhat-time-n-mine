import { HardhatRuntimeEnvironment } from "hardhat/types";

export const getLastBlock = (hre: HardhatRuntimeEnvironment) =>
  hre.network.provider.send("eth_getBlockByNumber", ["latest", false]);
