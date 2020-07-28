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
  errorMessage: string;
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
