import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BalanceInfo } from "components/BalanceInfo";
import { ClaimableBalances } from "components/ClaimableBalances";
import { TransactionHistory } from "components/TransactionHistory";
import { LiquidityPoolTransactions } from "components/LiquidityPoolTransactions";
import { logEvent } from "helpers/tracking";
import { fetchFlaggedAccountsAction } from "ducks/flaggedAccounts";
import { fetchMemoRequiredAccountsAction } from "ducks/memoRequiredAccounts";
import { AppDispatch } from "config/store";

export const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFlaggedAccountsAction());
    dispatch(fetchMemoRequiredAccountsAction());
    logEvent("page: saw account main screen");
  }, [dispatch]);

  return (
    <>
      <BalanceInfo />
      <ClaimableBalances />
      <TransactionHistory />
      <LiquidityPoolTransactions />
    </>
  );
};
