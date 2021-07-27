import StellarSdk from "stellar-sdk";

export const TX_HISTORY_LIMIT = 100;
export const TX_HISTORY_MIN_AMOUNT = 0.5;
export const RESET_STORE_ACTION_TYPE = "RESET";
export const FLAGGED_ACCOUNT_STORAGE_ID = "flaggedAcounts";
export const FLAGGED_ACCOUNT_DATE_STORAGE_ID = "flaggedAcountDate";
export const MEMO_REQ_ACCOUNT_STORAGE_ID = "memoRequiredAccounts";
export const MEMO_REQ_ACCOUNT_DATE_STORAGE_ID = "memoRequiredAccountsDate";
export const LOCAL_STORAGE_STELLAR_THEME = "stellarTheme:accountViewer";

interface NetworkItemConfig {
  url: string;
  network: string;
  stellarExpertTxUrl: string;
  stellarExpertAccountUrl: string;
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
    stellarExpertAccountUrl: "https://stellar.expert/explorer/testnet/account/",
  },
  public: {
    url: "https://horizon.stellar.org",
    network: StellarSdk.Networks.PUBLIC,
    stellarExpertTxUrl: "https://stellar.expert/explorer/public/tx/",
    stellarExpertAccountUrl: "https://stellar.expert/explorer/public/account/",
  },
};

export const defaultStellarBipPath = "44'/148'/0'";
