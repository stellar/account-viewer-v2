import { Transaction, Horizon } from "@stellar/stellar-sdk";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { signTransaction } from "helpers/keyManager";
import { signLedgerTransaction } from "helpers/signLedgerTransaction";
import { signTrezorTransaction } from "helpers/signTrezorTransaction";
import { AuthType } from "types/types";

export const submitPaymentTransaction = async (transaction: Transaction) => {
  const { settings, keyStore, walletLedger, walletTrezor } = store.getState();
  const server = new Horizon.Server(getNetworkConfig(settings.isTestnet).url);

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
      if (walletLedger.data?.publicKey && walletLedger.data?.bipPath) {
        signedTransaction = await signLedgerTransaction(
          transaction,
          walletLedger.data.publicKey,
          walletLedger.data.bipPath,
        );
      } else {
        throw Error("Ledger transaction failed");
      }
    } else if (settings.authType === AuthType.TREZOR) {
      if (
        walletTrezor.data &&
        walletTrezor.data.publicKey &&
        walletTrezor.data.bipPath
      ) {
        signedTransaction = await signTrezorTransaction(
          transaction,
          walletTrezor.data.publicKey,
          walletTrezor.data.bipPath,
        );
      } else {
        throw Error("Trezor transaction failed");
      }
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
