import { BigNumber } from "bignumber.js";

export const formatAmount = (amount: string | number) =>
  new BigNumber(amount).toString();
