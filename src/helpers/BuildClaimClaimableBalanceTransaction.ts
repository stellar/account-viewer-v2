import StellarSdk, { MemoType, MemoValue } from "stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";

interface buildClaimableBalanceProps {
  publicKey: string;
  balanceId: string;
  fee: number;
}

export const buildPaymentTransaction = async (
  params: buildClaimableBalanceProps,
) => {
  let transaction;
  try {
    const {
      publicKey,
      balanceId,
      fee,
    } = params;
    const { settings } = store.getState();
    const server = new StellarSdk.Server(
      getNetworkConfig(settings.isTestnet).url,
    );
    const sequence = (await server.loadAccount(publicKey)).sequence;
    const source = await new StellarSdk.Account(publicKey, sequence);

    const operation = StellarSdk.Operation.claimClaimableBalance({
      balanceId: balanceId.toString(),
    });
    

    transaction = new StellarSdk.TransactionBuilder(source, {
      fee,
      networkPassphrase: getNetworkConfig(settings.isTestnet).network,
      timebounds: await server.fetchTimebounds(100),
    }).addOperation(operation);

    transaction = transaction.build();
  } catch (error) {
    throw new Error(
      `Failed to build transaction, error: ${getErrorString(error)})}`,
    );
  }
  return transaction;
};
