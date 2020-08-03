import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import { Types } from "@stellar/wallet-sdk";
import { TX_HISTORY_MIN_AMOUNT } from "constants/settings";
import { ActionStatus } from "constants/types.d";
import {
  fetchTxHistoryAction,
  startTxHistoryWatcherAction,
} from "ducks/txHistory";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { ErrorMessage } from "components/ErrorMessage";

const El = styled.div`
  padding-bottom: 10px;
`;

const ItemRowEl = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

const ItemCellEl = styled.div`
  margin-bottom: 10px;
`;

const ItemCellTitleEl = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

const TempLinkButtonEl = styled.div`
  margin-bottom: 20px;
  text-decoration: underline;
  cursor: pointer;
`;

export const TransactionHistory = () => {
  const { account, txHistory, settings } = useRedux([
    "account",
    "txHistory",
    "settings",
  ]);
  const accountId = account.data?.id;
  const dispatch = useDispatch();
  const [showAllTxs, setShowAllTxs] = useState(false);
  const {
    status,
    data,
    isTxWatcherStarted,
    errorString,
    hasMoreTx,
  } = txHistory;

  const { errorMessage } = useErrorMessage({ initialMessage: errorString });

  useEffect(() => {
    if (accountId) {
      dispatch(fetchTxHistoryAction(accountId));
    }
  }, [accountId, dispatch]);

  useEffect(() => {
    if (status === ActionStatus.SUCCESS && !isTxWatcherStarted) {
      dispatch(startTxHistoryWatcherAction(accountId));
    }
  }, [status, isTxWatcherStarted, accountId, dispatch]);

  const filterOutSmallAmounts = (transactions: Types.Payment[]) =>
    transactions.filter((tx) =>
      new BigNumber(tx.amount).gt(TX_HISTORY_MIN_AMOUNT),
    );

  const visibleTransactions = showAllTxs ? data : filterOutSmallAmounts(data);
  const hasTransactions = data && data.length > 0;
  const hasVisibleTransactions =
    visibleTransactions && visibleTransactions.length > 0;

  return (
    <El>
      <h2>Payments History</h2>

      <ErrorMessage message={errorMessage} />

      {hasTransactions && (
        <El>
          <div>
            {`${
              showAllTxs ? "Including" : "Hiding"
            } payments smaller than 0.5XLM`}{" "}
            <TempLinkButtonEl onClick={() => setShowAllTxs(!showAllTxs)}>
              {showAllTxs ? "Hide small payments" : "Show all"}
            </TempLinkButtonEl>
          </div>
        </El>
      )}

      {!hasVisibleTransactions && <El>There are no payments to show</El>}

      {hasVisibleTransactions && (
        <>
          <El>
            {visibleTransactions?.map((pt: any) => (
              <ItemRowEl key={pt.id}>
                <ItemCellTitleEl>Date/Time</ItemCellTitleEl>
                <ItemCellEl>{new Date(pt.timestamp).toString()}</ItemCellEl>
                <ItemCellTitleEl>Address</ItemCellTitleEl>
                <ItemCellEl>{pt.otherAccount?.publicKey}</ItemCellEl>
                <ItemCellTitleEl>Amount</ItemCellTitleEl>
                <ItemCellEl>{new BigNumber(pt.amount).toString()}</ItemCellEl>
                <ItemCellTitleEl>Memo</ItemCellTitleEl>
                <ItemCellEl>
                  {pt.memoType} {pt.memo}
                </ItemCellEl>
                <ItemCellTitleEl>Operation ID</ItemCellTitleEl>
                <ItemCellEl>
                  <a
                    href={`${
                      getNetworkConfig(settings.isTestnet).stellarExpertTxUrl
                    }${pt.transactionId}`}
                  >
                    {pt.id}
                  </a>
                </ItemCellEl>
              </ItemRowEl>
            ))}
          </El>
          {hasMoreTx && (
            <El>
              <a
                href={`${
                  getNetworkConfig(settings.isTestnet).stellarExpertAccountUrl
                }${accountId}`}
              >
                View full list of transactions
              </a>
            </El>
          )}
        </>
      )}
    </El>
  );
};
