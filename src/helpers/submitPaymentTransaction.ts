import StellarSdk, { Transaction } from "stellar-sdk";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import LedgerApi from "@ledgerhq/hw-app-str";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { loadPrivateKey, signTransaction } from "helpers/keyManager";
import { AuthType } from "types/types.d";

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

const signLedgerTransaction = async (
  transaction: Transaction,
  keyStore: any,
) => {
  const key = await loadPrivateKey({
    id: keyStore.keyStoreId,
    password: keyStore.password,
  });

  const transport = await TransportWebUSB.create();
  const ledgerApi = new LedgerApi(transport);
  const result = await ledgerApi.signTransaction(
    key.path,
    transaction.signatureBase(),
  );

  const keyPair = StellarSdk.Keypair.fromPublicKey(key.publicKey);
  const decoratedSignature = new StellarSdk.xdr.DecoratedSignature({
    hint: keyPair.signatureHint(),
    signature: result.signature,
  });
  transaction.signatures.push(decoratedSignature);

  return Promise.resolve(transaction);
};
