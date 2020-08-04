import React from "react";
import styled from "styled-components";
import { useRedux } from "hooks/useRedux";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";

const El = styled.div`
  padding-bottom: 10px;
`;

export const Dashboard = () => {
  const { account } = useRedux(["account"]);

  return (
    <El>
      <h1>Dashboard</h1>
      <El>{account.data.id}</El>

      <BalanceInfo />
      <TransactionHistory />
    </El>
  );
};
