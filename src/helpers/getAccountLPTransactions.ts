import { TX_HISTORY_LIMIT } from "constants/settings";
import {
  LiquidityPoolOperation,
  LiquidityPoolAccountTransaction,
} from "types/types";

interface GetAccountLPTransactionsProps {
  server: any;
  publicKey: string;
}

export const getAccountLPTransactions = async ({
  server,
  publicKey,
}: GetAccountLPTransactionsProps): Promise<
  LiquidityPoolAccountTransaction[]
> => {
  const accountOperationsResponse = await server
    .operations()
    .forAccount(publicKey)
    .order("desc")
    .limit(TX_HISTORY_LIMIT)
    .call();

  return (accountOperationsResponse.records || [])
    .filter(
      (r: LiquidityPoolOperation) =>
        r.type === "liquidity_pool_deposit" ||
        r.type === "liquidity_pool_withdraw",
    )
    .map((lptx: LiquidityPoolOperation) => {
      /* eslint-disable camelcase */
      const {
        created_at: createdAt,
        id,
        liquidity_pool_id: liquidityPoolId,
        shares,
        shares_received,
        transaction_hash: transactionHash,
        type,
        reserves_received,
        reserves_deposited,
      } = lptx;

      return {
        tokens: reserves_received || reserves_deposited,
        createdAt,
        id,
        liquidityPoolId,
        shares: shares || shares_received,
        transactionHash,
        type,
      };
      /* eslint-enable camelcase */
    });
};
