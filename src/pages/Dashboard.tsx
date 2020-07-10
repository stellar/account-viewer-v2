import React from "react";
import styled from "styled-components";
import { useRedux } from "hooks/useRedux";
import { TransactionHistory } from "components/TransactionHistory";

const El = styled.div`
  padding-bottom: 10px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const Dashboard = () => {
  const { account } = useRedux(["account"]);

  let nativeBalance = 0;
  if (account.data) {
    nativeBalance = account.data.balances.native.total.toFixed();
  }

  return (
    <El>
      <El>Dashboard</El>
      <El>{account.publicKey}</El>
      <El>Your Balance</El>
      <El>{nativeBalance} lumens</El>
      <TempButtonEl>Send</TempButtonEl>
      <TempButtonEl>Receive</TempButtonEl>
      <El>
        <TransactionHistory />
      </El>
    </El>
  );
};
