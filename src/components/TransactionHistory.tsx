import { useEffect, useState } from "react";
import moment from "moment";
import { Horizon } from "stellar-sdk";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  Heading2,
  TextLink,
  Identicon,
  Layout,
  Table,
} from "@stellar/design-system";
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

import { NATIVE_ASSET_CODE, TX_HISTORY_MIN_AMOUNT } from "constants/settings";
import { AppDispatch } from "config/store";
import { ActionStatus } from "types/types";

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

  const renderTableRow = (item: Types.Payment) => (
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
          <Heading2>Payments History</Heading2>

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
          emptyMessage="There are no payments to show"
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
