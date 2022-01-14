import StellarSdk from "stellar-sdk";

export const TX_HISTORY_LIMIT = 100;
export const TX_HISTORY_MIN_AMOUNT = 0.5;
export const RESET_STORE_ACTION_TYPE = "RESET";
export const FLAGGED_ACCOUNT_STORAGE_ID = "flaggedAcounts";
export const FLAGGED_ACCOUNT_DATE_STORAGE_ID = "flaggedAcountDate";
export const MEMO_REQ_ACCOUNT_STORAGE_ID = "memoRequiredAccounts";
export const MEMO_REQ_ACCOUNT_DATE_STORAGE_ID = "memoRequiredAccountsDate";
export const LOCAL_STORAGE_STELLAR_THEME = "stellarTheme:accountViewer";
export const NATIVE_ASSET_CODE = "XLM";
const STELLAR_EXPERT_URL = "https://stellar.expert/explorer";

interface NetworkItemConfig {
  url: string;
  network: string;
  stellarExpertTxUrl: string;
  stellarExpertAccountUrl: string;
  stellarExpertAssetUrl: string;
  stellarExpertLiquidityPoolUrl: string;
}

interface NetworkConfig {
  testnet: NetworkItemConfig;
  public: NetworkItemConfig;
}

export const networkConfig: NetworkConfig = {
  testnet: {
    url: "https://horizon-testnet.stellar.org",
    network: StellarSdk.Networks.TESTNET,
    stellarExpertTxUrl: `${STELLAR_EXPERT_URL}/testnet/tx/`,
    stellarExpertAccountUrl: `${STELLAR_EXPERT_URL}/testnet/account/`,
    stellarExpertAssetUrl: `${STELLAR_EXPERT_URL}/testnet/asset/`,
    stellarExpertLiquidityPoolUrl: `${STELLAR_EXPERT_URL}/testnet/liquidity-pool/`,
  },
  public: {
    url: "https://horizon.stellar.org",
    network: StellarSdk.Networks.PUBLIC,
    stellarExpertTxUrl: `${STELLAR_EXPERT_URL}/public/tx/`,
    stellarExpertAccountUrl: `${STELLAR_EXPERT_URL}/public/account/`,
    stellarExpertAssetUrl: `${STELLAR_EXPERT_URL}/public/asset/`,
    stellarExpertLiquidityPoolUrl: `${STELLAR_EXPERT_URL}/public/liquidity-pool/`,
  },
};

export const defaultStellarBipPath = "44'/148'/0'";
