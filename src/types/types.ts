import React from "react";
import { MemoType, MemoValue, Horizon, Transaction } from "stellar-sdk";
import { Types } from "@stellar/wallet-sdk";

declare global {
  interface Window {
    _env_: {
      AMPLITUDE_API_KEY: string;
    };
  }
}

export enum AssetType {
  NATIVE = "native",
}

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
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum AuthType {
  ALBEDO = "ALBEDO",
  LEDGER = "LEDGER",
  FREIGHTER = "FREIGHTER",
  PRIVATE_KEY = "PRIVATE_KEY",
  TREZOR = "TREZOR",
}

export interface ModalPageProps {
  onClose?: () => void;
}

export enum ModalType {
  SIGNIN_SECRET_KEY = "SIGNIN_SECRET_KEY",
  SIGNIN_TREZOR = "SIGNIN_TREZOR",
  SIGNIN_LEDGER = "SIGNIN_LEDGER",
  SIGNIN_FREIGHTER = "SIGNIN_FREIGHTER",
  SIGNIN_ALBEDO = "SIGNIN_ALBEDO",
  NEW_KEY_PAIR = "NEW_KEY_PAIR",
}

// Store
export interface AccountInitialState {
  data: Types.AccountDetails | null;
  isAuthenticated: boolean;
  isAccountWatcherStarted: boolean;
  isUnfunded: boolean;
  status: ActionStatus | undefined;
  errorString: string | undefined;
}

interface FlaggedAccount {
  address: string;
  tags: string[];
}

export interface FlaggedAccounts {
  data: FlaggedAccount[];
  status: ActionStatus | undefined;
}

export interface MemoRequiredAccount {
  address: string;
  name: string;
  domain?: string;
}

export interface MemoRequiredAccountsResponse {
  [key: string]: MemoRequiredAccount;
}

export interface MemoRequiredAccountsInitialState {
  data: MemoRequiredAccountsResponse;
  status: ActionStatus | undefined;
}

export interface KeyStoreInitialState {
  keyStoreId: string;
  password: string;
  errorString: string | undefined;
  custom?: {
    [key: string]: any;
  };
}

export interface LiquidityPoolInitialState {
  data: LiquidityPoolAccountTransaction[];
  hasMoreTxs?: boolean;
  status: ActionStatus | undefined;
  errorString: string | undefined;
}

export interface ClaimableBalancesInitialState {
  data: ClaimableBalance[];
  status: ActionStatus | undefined;
  errorString: string | undefined;
}

export interface SendTxInitialState {
  data: Horizon.TransactionResponse | null;
  status: ActionStatus | undefined;
  errorString: string | undefined;
}

export interface SettingsInitialState {
  authType: AuthType | undefined;
  isTestnet: boolean;
}

export interface Setting {
  [key: string]: any;
}

export interface TxHistoryInitialState {
  data: Types.Payment[];
  hasMoreTxs?: boolean;
  isTxWatcherStarted: boolean;
  errorString: string | undefined;
  status: ActionStatus | undefined;
}

export interface WalletInitialState {
  data: { publicKey: string } | null;
  status: ActionStatus | undefined;
  errorString: string | undefined;
}

export interface Store {
  account: AccountInitialState;
  claimableBalances: ClaimableBalancesInitialState;
  flaggedAccounts: FlaggedAccounts;
  keyStore: KeyStoreInitialState;
  liquidityPoolTx: LiquidityPoolInitialState;
  memoRequiredAccounts: MemoRequiredAccountsInitialState;
  sendTx: SendTxInitialState;
  settings: SettingsInitialState;
  txHistory: TxHistoryInitialState;
  walletAlbedo: WalletInitialState;
  walletLedger: WalletInitialState;
  walletFreighter: WalletInitialState;
  walletTrezor: WalletInitialState;
}

export type StoreKey = keyof Store;

export interface WalletData {
  title: string;
  logoSvg: React.ReactNode;
  modalType: ModalType;
  infoText: React.ReactNode | string;
  infoLinkText: string;
  infoLink: string;
}

export interface Wallets {
  [key: string]: WalletData;
}

export interface PaymentFormData {
  toAccountId: string;
  federationAddress?: string;
  amount: string;
  memoType: MemoType;
  memoContent: MemoValue;
  isAccountFunded: boolean;
  isAccountUnsafe: boolean;
  tx: Transaction | undefined;
}

export interface AnyObject {
  [key: string]: any;
}

export enum StellarThemeValue {
  LIGHT = "light-mode",
  DARK = "dark-mode",
}

export interface LiquidityPoolToken {
  asset: string;
  amount: string;
}

export interface LiquidityPoolOperation {
  [key: string]: any;
  id: string;
  type: string;
  /* eslint-disable camelcase */
  created_at: string;
  transaction_hash: string;
  liquidity_pool_id: string;
  reserves_deposited: LiquidityPoolToken[];
  shares_received: string;
  /* eslint-enable camelcase */
}

export interface LiquidityPoolAccountTransaction {
  tokens: LiquidityPoolToken[];
  createdAt: string;
  id: string;
  liquidityPoolId: string;
  shares: string;
  transactionHash: string;
  type: string;
}

interface ClaimableBalanceCommon {
  id: string;
  amount: string;
  sponsor: string;
}

export interface ClaimableBalance extends ClaimableBalanceCommon {
  asset: {
    code: string;
    issuer: string;
  };
}

export interface ClaimableBalanceRecord extends ClaimableBalanceCommon {
  [key: string]: any;
  asset: string;
}
