import { useEffect, useState } from "react";
import moment from "moment";
import { Horizon } from "stellar-sdk";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import { Heading2, TextLink, Identicon, Layout } from "@stellar/design-system";
import { Types } from "@stellar/wallet-sdk";

import {
  fetchTxHistoryAction,
  startTxHistoryWatcherAction,
} from "ducks/txHistory";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { getMemoTypeText } from "helpers/getMemoTypeText";
import { ErrorMessage } from "components/ErrorMessage";

import { TX_HISTORY_MIN_AMOUNT } from "constants/settings";
import { ActionStatus } from "types/types.d";

const LABEL_DATE_TIME = "Date/Time";
const LABEL_ADDRESS = "Address";
const LABEL_AMOUNT = "Amount";
const LABEL_MEMO = "Memo";
const LABEL_OPERATION_ID = "Operation ID";

export const TransactionHistory = () => {
  const { account, txHistory, settings } = useRedux(
    "account",
    "txHistory",
    "settings",
  );
  const accountId = account.data?.id;
  const isUnfunded = account.isUnfunded;
  const dispatch = useDispatch();
  const [showAllTxs, setShowAllTxs] = useState(false);
  const { status, data, isTxWatcherStarted, errorString, hasMoreTxs } =
    txHistory;

  const { errorMessage } = useErrorMessage({ initialMessage: errorString });

  useEffect(() => {
    if (accountId && !isUnfunded) {
      dispatch(fetchTxHistoryAction(accountId));
    }
  }, [accountId, isUnfunded, dispatch]);

  useEffect(() => {
    if (status === ActionStatus.SUCCESS && accountId && !isTxWatcherStarted) {
      dispatch(startTxHistoryWatcherAction(accountId));
    }
  }, [status, isTxWatcherStarted, accountId, dispatch]);

  const isAccountMerge = (pt: Types.Payment) =>
    pt.type === Horizon.OperationResponseType.accountMerge;

  const filterOutSmallAmounts = (transactions: Types.Payment[]) =>
    transactions.filter((tx) => {
      if (isAccountMerge(tx)) {
        return true;
      }

      return new BigNumber(tx.amount).gt(TX_HISTORY_MIN_AMOUNT);
    });

  const visibleTransactions = showAllTxs ? data : filterOutSmallAmounts(data);
  const hasHiddenTransactions =
    data.length - filterOutSmallAmounts(data).length > 0;
  const hasVisibleTransactions =
    visibleTransactions && visibleTransactions.length > 0;

  const getPublicAddress = (pt: Types.Payment) =>
    pt.mergedAccount?.publicKey || pt.otherAccount?.publicKey;

  const getFormattedAmount = (pt: Types.Payment) => {
    if (!pt?.amount) {
      return "";
    }
    const amount = new BigNumber(pt.amount).toString();
    const { isRecipient, token } = pt;
    return `${(isRecipient ? "+" : "-") + amount} ${token.code}`;
  };

  const getFormattedMemo = (pt: Types.Payment) => {
    const memoType = getMemoTypeText(pt.memoType);

    return (
      <div
        className="TransactionHistory__memo"
        aria-hidden={!memoType && !pt.memo}
      >
        {memoType && <code>{memoType}</code>}
        {pt.memo && <span>{pt.memo}</span>}
      </div>
    );
  };

  return (
    <div className="TransactionHistory DataSection">
      <Layout.Inset>
        <div className="TransactionHistory__header">
          <Heading2>Payments History</Heading2>

          {hasHiddenTransactions && (
            <div className="TransactionHistory__header__note">
              <span>
                {`${
                  showAllTxs ? "Including" : "Hiding"
                } payments smaller than 0.5 XLM`}{" "}
              </span>

              <TextLink
                role="button"
                onClick={() => setShowAllTxs(!showAllTxs)}
                variant={TextLink.variant.secondary}
                underline
              >
                {showAllTxs ? "Hide small payments" : "Show all"}
              </TextLink>
            </div>
          )}
        </div>

        <ErrorMessage message={errorMessage} marginBottom="2rem" />

        {!hasVisibleTransactions && <p>There are no payments to show</p>}

        {hasVisibleTransactions && (
          <>
            <div className="TableContainer">
              <table className="Table">
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
                      <td>
                        <Identicon
                          publicAddress={getPublicAddress(pt)}
                          shortenAddress
                        />
                      </td>
                      <td>
                        {isAccountMerge(pt) && <code>account merge</code>}
                        <span>{getFormattedAmount(pt)}</span>
                      </td>
                      <td>{getFormattedMemo(pt)}</td>
                      <td>
                        <TextLink
                          href={`${
                            getNetworkConfig(settings.isTestnet)
                              .stellarExpertTxUrl
                          }${pt.transactionId}`}
                          variant={TextLink.variant.secondary}
                          underline
                        >
                          {pt.id}
                        </TextLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMoreTxs && (
              <div className="TableNoteContainer">
                <TextLink
                  href={`${
                    getNetworkConfig(settings.isTestnet).stellarExpertAccountUrl
                  }${accountId}`}
                >
                  View full list of transactions
                </TextLink>
              </div>
            )}
          </>
        )}
      </Layout.Inset>
    </div>
  );
};
