import React from "react";
import styled from "styled-components";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";

const El = styled.div`
  padding-bottom: 10px;
`;

export const Dashboard = () => (
  <El>
    <h1>Dashboard</h1>
    <BalanceInfo />
    <TransactionHistory />
  </El>
);
