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
