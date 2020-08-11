import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import StellarSdk from "stellar-sdk";
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

const ItemRowEl = styled.tr``;

const ItemCellEl = styled.td`
  padding: 8px;
  heigh: 30px;
`;

const TempLinkButtonEl = styled.span`
  margin-bottom: 20px;
  text-decoration: underline;
  cursor: pointer;
`;

const FlexRowEl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableEl = styled.table`
  width: 100%;
`;

const TableHeadEl = styled.thead`
  text-align: left;
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
    hasMoreTxs,
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

  const getFormattedPublicKey = (pk: string) =>
    `${pk.slice(0, 8)}…${pk.slice(52)}`;

  const getFormattedAmount = (pt: Types.Payment) => {
    const amount = new BigNumber(pt.amount).toString();
    const { isRecipient, token } = pt;
    return `${(isRecipient ? "+ " : "- ") + amount} ${token.code}`;
  };

  const getFormattedMemo = (pt: Types.Payment) => {
    let memoType;
    switch (pt.memoType) {
      case StellarSdk.MemoText:
        memoType = "MEMO_TEXT";
        break;
      case StellarSdk.MemoHash:
        memoType = "MEMO_HASH";
        break;
      case StellarSdk.MemoID:
        memoType = "MEMO_ID";
        break;
      case StellarSdk.MemoReturn:
        memoType = "MEMO_RETURN";
        break;
      default:
        memoType = "";
        break;
    }
    return (
      <El>
        <div>{memoType}</div>
        <div>{pt.memo}</div>
      </El>
    );
  };

  return (
    <El>
      <FlexRowEl>
        <div>
          <h2>Payments History</h2>
        </div>
        <div>
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
        </div>
      </FlexRowEl>

      <ErrorMessage message={errorMessage} />

      {!hasVisibleTransactions && <El>There are no payments to show</El>}

      {hasVisibleTransactions && (
        <>
          <TableEl>
            <TableHeadEl>
              <tr>
                <th>Date/Time</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Memo</th>
                <th>Operation ID</th>
              </tr>
            </TableHeadEl>
            <tbody>
              {visibleTransactions?.map((pt: any) => (
                <ItemRowEl key={pt.id}>
                  <ItemCellEl>
                    {moment.unix(pt.timestamp).format("l HH:mm")}
                  </ItemCellEl>
                  <ItemCellEl>
                    {getFormattedPublicKey(pt.otherAccount?.publicKey)}
                  </ItemCellEl>
                  <ItemCellEl>{getFormattedAmount(pt)}</ItemCellEl>
                  <ItemCellEl>{getFormattedMemo(pt)}</ItemCellEl>
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
            </tbody>
          </TableEl>
          {hasMoreTxs && (
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
