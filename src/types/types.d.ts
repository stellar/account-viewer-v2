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

export interface WalletInitialState {
  data: { publicKey: string } | null;
  status: ActionStatus | undefined;
  errorString?: string;
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

export interface Store {
  // TODO: update with proper keys and types
  [key: string]: any;
}

export type StoreKey = keyof Store;
