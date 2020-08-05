import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { resetStoreAction } from "config/store";
import { stopAccountWatcherAction } from "ducks/account";
import { stopTxHistoryWatcherAction } from "ducks/txHistory";
import { useRedux } from "hooks/useRedux";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";

const El = styled.div`
  padding-bottom: 10px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { account } = useRedux(["account"]);

  const handleSignOut = () => {
    dispatch(stopAccountWatcherAction());
    dispatch(stopTxHistoryWatcherAction());
    dispatch(resetStoreAction());
  };

  return (
    <El>
      <h1>Dashboard</h1>
      <El>{account.data.id}</El>
      <TempButtonEl onClick={handleSignOut}>Sign out</TempButtonEl>

      <BalanceInfo />
      <TransactionHistory />
    </El>
  );
};
