import StellarSdk from "stellar-sdk";

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
