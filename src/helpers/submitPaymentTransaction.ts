import StellarSdk, { Transaction } from "stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { signTransaction } from "helpers/keyManager";

export const submitPaymentTransaction = async (transaction: Transaction) => {
  const { settings, keyStore } = store.getState();
  const server = new StellarSdk.Server(
    getNetworkConfig(settings.isTestnet).url,
  );

  try {
    const signedTransaction = await signTransaction({
      id: keyStore.keyStoreId,
      password: keyStore.password,
      transaction,
      custom: keyStore.custom,
    });

    return await server.submitTransaction(signedTransaction);
  } catch (error) {
    throw new Error(
      `Failed to sign transaction, error: ${getErrorString(error)}`,
    );
  }
};
