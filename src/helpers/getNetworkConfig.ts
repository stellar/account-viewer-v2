import { networkConfig } from "constants/settings";
import { NetworkType } from "constants/types.d";

export const getNetworkConfig = (isTestnet: boolean) => {
  const network = isTestnet ? NetworkType.TESTNET : NetworkType.PUBLIC;
  return networkConfig[network];
};
