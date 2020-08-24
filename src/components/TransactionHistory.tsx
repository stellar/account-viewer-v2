import React, { useEffect, useState } from "react";
import moment from "moment";
import styled, { css } from "styled-components";
import StellarSdk from "stellar-sdk";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import { Types } from "@stellar/wallet-sdk";

import {
  fetchTxHistoryAction,
  startTxHistoryWatcherAction,
} from "ducks/txHistory";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { getFormattedPublicKey } from "helpers/getFormattedPublicKey";
import { ErrorMessage } from "components/ErrorMessage";

import { TX_HISTORY_MIN_AMOUNT } from "constants/settings";
import { FONT_WEIGHT, PALETTE } from "constants/styles";
import { ActionStatus } from "types/types.d";

const LABEL_DATE_TIME = "Date/Time";
const LABEL_ADDRESS = "Address";
const LABEL_AMOUNT = "Amount";
const LABEL_MEMO = "Memo";
const LABEL_OPERATION_ID = "Operation ID";

const El = styled.div`
  padding-bottom: 10px;
`;

const LabelStyle = css`
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: ${PALETTE.black60};
  font-weight: ${FONT_WEIGHT.medium};
  text-transform: uppercase;
  text-align: left;
  padding-bottom: 1.0625rem;
`;

const TableEl = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    ${LabelStyle};
  }

  thead, tr:not(:last-child) {
    border-bottom: 1px solid ${PALETTE.white60};
  }

  @media (min-width: 800px) {
    th, td {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    th:first-child,
    td:first-child {
      padding-left: 0;
    }

    th:last-child,
    td:last-child {
      padding-right: 0;
    }

    td {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }

    th:nth-of-type(3),
    th:nth-of-type(5),
    td:nth-of-type(3),
    td:nth-of-type(5) {
      text-align: right;
    }
  }

  @media (max-width: 800px) {
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }

    /* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    td {
      position: relative;
      padding-left: 50%;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }

    td::before {
      ${LabelStyle};
      position: absolute;
      white-space: nowrap;
      top: 1.5rem;
      left: 0;
    }

    /*
    Label the data
    */
    td:nth-of-type(1)::before {
      content: "${LABEL_DATE_TIME}";
    }
    td:nth-of-type(2):before {
      content: "${LABEL_ADDRESS}";
    }
    td:nth-of-type(3):before {
      content: "${LABEL_AMOUNT}";
    }
    td:nth-of-type(4):before {
      content: "${LABEL_MEMO}";
    }
    td:nth-of-type(5):before {
      content: "${LABEL_OPERATION_ID}";
    }
  }
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

  const getFormattedAmount = (pt: Types.Payment) => {
    if (!pt?.amount) {
      return "";
    }
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
            <thead>
              <tr>
                <th>{LABEL_DATE_TIME}</th>
                <th>{LABEL_ADDRESS}</th>
                <th>{LABEL_AMOUNT}</th>
                <th>{LABEL_MEMO}</th>
                <th>{LABEL_OPERATION_ID}</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions?.map((pt: Types.Payment) => (
                <tr key={pt.id}>
                  <td>{moment.unix(pt.timestamp).format("l HH:mm")}</td>
                  <td>{getFormattedPublicKey(pt.otherAccount?.publicKey)}</td>
                  <td>{getFormattedAmount(pt)}</td>
                  <td>{getFormattedMemo(pt)}</td>
                  <td>
                    <a
                      href={`${
                        getNetworkConfig(settings.isTestnet).stellarExpertTxUrl
                      }${pt.transactionId}`}
                    >
                      {pt.id}
                    </a>
                  </td>
                </tr>
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
