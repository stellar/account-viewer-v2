import { networkConfig } from "constants/settings";
import { NetworkType } from "types/types";

export const getNetworkConfig = (isTestnet: boolean) => {
  const network = isTestnet ? NetworkType.TESTNET : NetworkType.PUBLIC;
  return networkConfig[network];
};
