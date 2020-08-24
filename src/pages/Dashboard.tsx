import React from "react";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";

export const Dashboard = () => (
  <>
    <BalanceInfo />
    <TransactionHistory />
  </>
);
