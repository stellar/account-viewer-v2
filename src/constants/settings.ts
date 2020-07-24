import StellarSdk from "stellar-sdk";
import { store } from "App";
import { NetworkType } from "constants/types.d";

interface NetworkItemConfig {
  url: string;
  network: string;
  stellarExpertTxUrl: string;
}

interface NetworkConfig {
  testnet: NetworkItemConfig;
  public: NetworkItemConfig;
}

export const networkConfig: NetworkConfig = {
  testnet: {
    url: "https://horizon-testnet.stellar.org",
    network: StellarSdk.Networks.TESTNET,
    stellarExpertTxUrl: "https://stellar.expert/explorer/testnet/tx/",
  },
  public: {
    url: "https://horizon.stellar.org",
    network: StellarSdk.Networks.PUBLIC,
    stellarExpertTxUrl: "https://stellar.expert/explorer/public/tx/",
  },
};

const isTestnet = () => {
  const { settings } = store.getState();
  return settings.isTestnet;
};

export const getNetworkConfig = () => {
  const network = isTestnet() ? NetworkType.TESTNET : NetworkType.PUBLIC;
  return networkConfig[network];
};

export const getServer = () => new StellarSdk.Server(getNetworkConfig().url);
