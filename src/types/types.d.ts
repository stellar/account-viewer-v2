export enum NetworkType {
  TESTNET = "testnet",
  PUBLIC = "public",
}

export enum ActionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface RejectMessage {
  errorString: string;
}

export enum NetworkCongestion {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum AuthType {
  ALBEDO = "ALBEDO",
  LEDGER = "LEDGER",
  LYRA = "LYRA",
  PRIVATE_KEY = "PRIVATE_KEY",
  TREZOR = "TREZOR",
}

export interface ModalPageProps {
  onClose?: () => void;
}

export interface ThemeProps {
  bodyBackground: string;
}

export interface Theme {
  [themeName: string]: ThemeProps;
}

export enum ModalType {
  SIGNIN_SECRET_KEY = "SIGNIN_SECRET_KEY",
  SIGNIN_TREZOR = "SIGNIN_TREZOR",
  SIGNIN_LEDGER = "SIGNIN_LEDGER",
  SIGNIN_LYRA = "SIGNIN_LYRA",
  SIGNIN_ALBEDO = "SIGNIN_ALBEDO",
  NEW_KEY_PAIR = "NEW_KEY_PAIR",
}

// Store
export interface AccountInitialState {
  data: Types.AccountDetails | null;
  isAuthenticated: boolean;
  isAccountWatcherStarted: boolean;
  status: ActionStatus | undefined;
  errorString?: string;
}

export interface KeyStoreInitialState {
  keyStoreId: string;
  password: string;
  errorString?: string;
}

export interface KnownAccount {
  address: string;
  name: string;
  [key: string]: any;
}

export interface KnownAccountsInitialState {
  data: KnownAccount[] | undefined;
  status: ActionStatus | undefined;
}

export interface SendTxInitialState {
  data: Horizon.TransactionResponse | null;
  status: ActionStatus | undefined;
  errorString?: string;
}

export interface SettingsInitialState {
  authType: AuthType | undefined;
  isTestnet: boolean;
}

export interface Setting {
  [key: string]: any;
}

export interface TxHistoryInitialState {
  data: Array<Types.Payment>;
  hasMoreTxs?: boolean;
  isTxWatcherStarted: boolean;
  errorString?: string;
  status: ActionStatus | undefined;
}

export interface WalletInitialState {
  data: { publicKey: string } | null;
  status: ActionStatus | undefined;
  errorString?: string;
}

export interface Store {
  account: AccountInitialState;
  keyStore: KeyStoreInitialState;
  knownAccounts: KnownAccountsInitialState;
  sendTx: SendTxInitialState;
  settings: SettingsInitialState;
  txHistory: TxHistoryInitialState;
  walletAlbedo: WalletInitialState;
  walletLedger: WalletInitialState;
  walletLyra: WalletInitialState;
  walletTrezor: WalletInitialState;
}

export type StoreKey = keyof Store;
