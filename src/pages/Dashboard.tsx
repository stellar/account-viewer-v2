import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";
import { logEvent } from "helpers/tracking";
import { fetchFlaggedAccountsAction } from "ducks/flaggedAccounts";

const WrapperEl = styled.div`
  width: 100%;
`;

export const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFlaggedAccountsAction());
    logEvent("page: saw account main screen");
  }, [dispatch]);

  return (
    <WrapperEl>
      <BalanceInfo />
      <TransactionHistory />
    </WrapperEl>
  );
};
