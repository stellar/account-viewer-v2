import { useEffect, useState } from "react";
import moment from "moment";
import { Horizon } from "@stellar/stellar-sdk";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  Heading2,
  TextLink,
  Identicon,
  Layout,
  Table,
  Icon,
} from "@stellar/design-system";

import {
  fetchTxHistoryAction,
  // startTxHistoryWatcherAction,
} from "ducks/txHistory";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { getMemoTypeText } from "helpers/getMemoTypeText";
import { ErrorMessage } from "components/ErrorMessage";

import { NATIVE_ASSET_CODE, TX_HISTORY_MIN_AMOUNT } from "constants/settings";
import { AppDispatch } from "config/store";
import { Payment } from "types/types";

export const TransactionHistory = () => {
  const { account, txHistory, settings } = useRedux(
    "account",
    "txHistory",
    "settings",
  );
  const accountId = account.data?.id;
  const isUnfunded = account.isUnfunded;
  const dispatch: AppDispatch = useDispatch();
  const [showAllTxs, setShowAllTxs] = useState(false);
  const { data, errorString, hasMoreTxs } = txHistory;

  const { errorMessage } = useErrorMessage({ initialMessage: errorString });

  useEffect(() => {
    if (accountId && !isUnfunded) {
      dispatch(fetchTxHistoryAction(accountId));
    }
  }, [accountId, isUnfunded, dispatch]);

  // useEffect(() => {
  //   if (status === ActionStatus.SUCCESS && accountId &&
  // !isTxWatcherStarted) {
  //     dispatch(startTxHistoryWatcherAction(accountId));
  //   }
  // }, [status, isTxWatcherStarted, accountId, dispatch]);

  const isAccountMerge = (pt: Payment) =>
    pt.type === Horizon.HorizonApi.OperationResponseType.accountMerge;

  const filterOutSmallAmounts = (transactions: Payment[]) =>
    transactions.filter((tx) => {
      if (isAccountMerge(tx)) {
        return true;
      }

      return new BigNumber(tx.amount).gt(TX_HISTORY_MIN_AMOUNT);
    });

  const visibleTransactions = showAllTxs ? data : filterOutSmallAmounts(data);
  const hasHiddenTransactions =
    data.length - filterOutSmallAmounts(data).length > 0;

  const getPublicAddress = (pt: Payment) =>
    pt.mergedAccount?.publicKey || pt.otherAccount?.publicKey;

  const getFormattedAmount = (pt: Payment) => {
    if (!pt?.amount) {
      return "";
    }
    const amount = new BigNumber(pt.amount).toString();
    const { isRecipient, token } = pt;
    return `${(isRecipient ? "+" : "-") + amount} ${token.code}`;
  };

  const getFormattedMemo = (pt: Payment) => {
    const memoType = getMemoTypeText(pt.memoType);

    return (
      <div
        className="TransactionHistory__memo"
        aria-hidden={!memoType && !pt.memo}
      >
        {memoType && <code>{memoType}</code>}
        {pt.memo && <span>{pt.memo as string}</span>}
      </div>
    );
  };

  const tableColumnLabels = [
    {
      id: "timestamp",
      label: "Date/Time",
    },
    {
      id: "address",
      label: "Address",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "memo",
      label: "Memo",
    },
    {
      id: "id",
      label: "Operation ID",
    },
  ];

  const renderTableRow = (item: Payment) => (
    <>
      <td>{moment.unix(item.timestamp).format("l HH:mm")}</td>
      <td>
        <Identicon publicAddress={getPublicAddress(item)} shortenAddress />
      </td>
      <td>
        {isAccountMerge(item) && <code>account merge</code>}
        <span>{getFormattedAmount(item)}</span>
      </td>
      <td>{getFormattedMemo(item)}</td>
      <td>
        <TextLink
          href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${
            item.transactionId
          }`}
          variant={TextLink.variant.secondary}
          underline
        >
          {item.id}
        </TextLink>
      </td>
    </>
  );

  return (
    <div className="TransactionHistory DataSection">
      <Layout.Inset>
        <div className="TransactionHistory__header">
          <div>
            <Heading2>Payments History</Heading2>
            <div className="TransactionHistory__header__refresh">
              <TextLink
                variant={TextLink.variant.secondary}
                onClick={() => {
                  if (account.data?.id) {
                    dispatch(fetchTxHistoryAction(account.data.id));
                  }
                }}
                iconRight={<Icon.RefreshCcw />}
                underline
              >
                Refresh history
              </TextLink>
            </div>
          </div>

          {hasHiddenTransactions && (
            <div className="TransactionHistory__header__note">
              <span>
                {`${
                  showAllTxs ? "Including" : "Hiding"
                } payments smaller than 0.5 ${NATIVE_ASSET_CODE}`}{" "}
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

        <Table
          columnLabels={tableColumnLabels}
          data={visibleTransactions}
          renderItemRow={renderTableRow}
          emptyMessage="There are no recent payments to show"
          hideNumberColumn
        />

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
      </Layout.Inset>
    </div>
  );
};
