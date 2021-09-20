import { useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { BigNumber } from "bignumber.js";
import { Layout, Heading2, TextLink } from "@stellar/design-system";
import { fetchLiquidityPoolTxAction } from "ducks/liquidityPoolTx";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { useRedux } from "hooks/useRedux";
import { LiquidityPoolToken } from "types/types.d";

export const LiquidityPoolTransactions = () => {
  const { account, liquidityPoolTx, settings } = useRedux(
    "account",
    "liquidityPoolTx",
    "settings",
  );
  const accountId = account?.data?.id;
  const lpTransactions = liquidityPoolTx.data;

  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchLiquidityPoolTxAction(accountId));
    }
  }, [accountId, dispatch]);

  const formatAmount = (amount: string) => new BigNumber(amount).toString();

  const getSharesString = (shares: string, type: string) => {
    const sign = type === "liquidity_pool_withdraw" ? "-" : "+";
    return `${sign}${formatAmount(shares)}`;
  };

  const getTokenString = (asset: string) => {
    if (asset === "native") {
      return "XLM";
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

  return (
    <div className="LiquidityPoolTransactions DataSection">
      <Layout.Inset>
        <Heading2>Liquidity Pool Transactions</Heading2>

        {!lpTransactions.length && (
          <p>There are no liquidity pool transactions to show</p>
        )}

        {lpTransactions.length && (
          <div className="TableContainer">
            <table className="Table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Liquidity Pool</th>
                  <th>Token Amount</th>
                  <th>Token Amount</th>
                  <th>Shares</th>
                  <th>Operation ID</th>
                </tr>
              </thead>
              <tbody>
                {lpTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{moment(tx.createdAt).format("l HH:mm")}</td>
                    {/* TODO: add LP link once available on stellar.expert */}
                    <td>{getPoolTitle(tx.tokens)}</td>
                    <td>{getTokenAmountString(tx.tokens[0])}</td>
                    <td>{getTokenAmountString(tx.tokens[1])}</td>
                    <td>{getSharesString(tx.shares, tx.type)}</td>
                    <td>
                      <TextLink
                        href={`${
                          getNetworkConfig(settings.isTestnet)
                            .stellarExpertTxUrl
                        }${tx.transactionHash}`}
                        variant={TextLink.variant.secondary}
                        underline
                      >
                        {tx.id}
                      </TextLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout.Inset>
    </div>
  );
};
