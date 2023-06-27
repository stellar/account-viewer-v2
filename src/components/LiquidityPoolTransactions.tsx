import { useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Layout, Heading2, TextLink, Table } from "@stellar/design-system";
import { NATIVE_ASSET_CODE } from "constants/settings";
import { AppDispatch } from "config/store";
import { fetchLiquidityPoolTxAction } from "ducks/liquidityPoolTx";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { formatAmount } from "helpers/formatAmount";
import { useRedux } from "hooks/useRedux";
import {
  LiquidityPoolToken,
  AssetType,
  LiquidityPoolAccountTransaction,
} from "types/types";

export const LiquidityPoolTransactions = () => {
  const { account, liquidityPoolTx, settings } = useRedux(
    "account",
    "liquidityPoolTx",
    "settings",
  );
  const accountId = account?.data?.id;
  const lpTransactions = liquidityPoolTx.data;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchLiquidityPoolTxAction(accountId));
    }
  }, [accountId, dispatch]);

  const getSharesString = (shares: string, type: string) => {
    const sign = type === "liquidity_pool_withdraw" ? "-" : "+";
    return `${sign}${formatAmount(shares)}`;
  };

  const getTokenString = (asset: string) => {
    if (asset === AssetType.NATIVE) {
      return NATIVE_ASSET_CODE;
    }

    return asset.split(":")[0];
  };

  const getPoolTitle = (lpTokens: LiquidityPoolToken[]) => {
    const tokenA = getTokenString(lpTokens[0].asset);
    const tokenB = getTokenString(lpTokens[1].asset);

    return `${tokenA} - ${tokenB}`;
  };

  const getTokenAmountString = (token: LiquidityPoolToken) =>
    `${formatAmount(token.amount)} ${getTokenString(token.asset)}`;

  const columnLabels = [
    { id: "lp-datetime", label: "Date/Time" },
    { id: "lp-pool", label: "Liquidity Pool" },
    { id: "lp-amount-a", label: "Token Amount" },
    { id: "lp-amount-b", label: "Token Amount" },
    { id: "lp-shares", label: "Shares" },
    { id: "lp-id", label: "Operation ID" },
  ];

  const renderTableRow = (tx: LiquidityPoolAccountTransaction) => (
    <>
      <td>{moment(tx.createdAt).format("l HH:mm")}</td>
      <td>
        <TextLink
          href={`${
            getNetworkConfig(settings.isTestnet).stellarExpertLiquidityPoolUrl
          }${tx.liquidityPoolId}`}
        >
          {getPoolTitle(tx.tokens)}
        </TextLink>
      </td>
      <td>{getTokenAmountString(tx.tokens[0])}</td>
      <td>{getTokenAmountString(tx.tokens[1])}</td>
      <td>{getSharesString(tx.shares, tx.type)}</td>
      <td>
        <TextLink
          href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${
            tx.transactionHash
          }`}
          variant={TextLink.variant.secondary}
          underline
        >
          {tx.id}
        </TextLink>
      </td>
    </>
  );

  return (
    <div className="LiquidityPoolTransactions DataSection">
      <Layout.Inset>
        <Heading2>Liquidity Pool Transactions</Heading2>

        <Table
          columnLabels={columnLabels}
          data={lpTransactions}
          renderItemRow={renderTableRow}
          emptyMessage="There are no recent liquidity pool transactions to show"
          hideNumberColumn
        />

        {liquidityPoolTx.hasMoreTxs && (
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
