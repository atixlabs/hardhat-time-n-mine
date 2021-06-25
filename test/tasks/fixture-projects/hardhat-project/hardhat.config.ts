// We load the plugin here.
// tslint:disable-next-line no-implicit-dependencies
import chai from "chai";
// tslint:disable-next-line no-implicit-dependencies
import chaiAsPromised from "chai-as-promised";
import { HardhatUserConfig } from "hardhat/types";

import "../../../../src/index";

chai.use(chaiAsPromised);

const config: HardhatUserConfig = {
  solidity: "0.7.6",
  defaultNetwork: "localhost",
};

export default config;
