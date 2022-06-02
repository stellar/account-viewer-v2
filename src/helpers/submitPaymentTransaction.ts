import StellarSdk, { Transaction } from "stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { signTransaction } from "helpers/keyManager";
import { signLedgerTransaction } from "helpers/signLedgerTransaction";
import { signTrezorTransaction } from "helpers/signTrezorTransaction";
import { AuthType } from "types/types";

export const submitPaymentTransaction = async (transaction: Transaction) => {
  const { settings, keyStore } = store.getState();
  const server = new StellarSdk.Server(
    getNetworkConfig(settings.isTestnet).url,
  );

  try {
    let signedTransaction: Transaction;

    // Ledger uses WebUSB API in TransportWebUSB, from their GitHub repo:
    // https://github.com/LedgerHQ/ledgerjs/tree/master/packages/hw-transport-webusb#faq-dom-exception-is-triggered-when-creating-the-transport
    // "The transport functions create() and listen() must be called in the
    // context of an user interaction (like a "click" event), otherwise it fails
    // with DOM Exception. This is by WebUSB design. You also must run on
    // HTTPS."
    // So we need to trigger the signing "directly" from the action, passing it
    // to the `wallet-sdk` fails because it's going through different layers.
    if (settings.authType === AuthType.LEDGER) {
      signedTransaction = await signLedgerTransaction(transaction, keyStore);
    } else if (settings.authType === AuthType.TREZOR) {
      signedTransaction = await signTrezorTransaction(transaction, keyStore);
    } else {
      signedTransaction = await signTransaction({
        id: keyStore.keyStoreId,
        password: keyStore.password,
        transaction,
        custom: keyStore.custom,
      });
    }

    return await server.submitTransaction(signedTransaction);
  } catch (error) {
    throw new Error(
      `Failed to sign transaction, error: ${getErrorString(error)}`,
    );
  }
};
