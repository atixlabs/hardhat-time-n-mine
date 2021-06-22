// We load the plugin here.
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

chai.use(chaiAsPromised);

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  defaultNetwork: "hardhat",
};

export default config;
