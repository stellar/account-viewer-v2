import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";
import { logEvent } from "helpers/tracking";
import { fetchFlaggedAccountsAction } from "ducks/flaggedAccounts";
import { fetchMemoRequiredAccountsAction } from "ducks/memoRequiredAccounts";

const WrapperEl = styled.div`
  width: 100%;
`;

export const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFlaggedAccountsAction());
    dispatch(fetchMemoRequiredAccountsAction());
    logEvent("page: saw account main screen");
  }, [dispatch]);

  return (
    <WrapperEl>
      <BalanceInfo />
      <TransactionHistory />
    </WrapperEl>
  );
};
