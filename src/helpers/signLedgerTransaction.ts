import { Keypair, Transaction, xdr } from "@stellar/stellar-sdk";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import LedgerApi from "@ledgerhq/hw-app-str";

export const signLedgerTransaction = async (
  transaction: Transaction,
  publicKey: string,
  bipPath: string,
) => {
  const transport = await TransportWebUSB.create();
  const ledgerApi = new LedgerApi(transport);
  const result = await ledgerApi.signTransaction(
    bipPath,
    transaction.signatureBase(),
  );

  const keyPair = Keypair.fromPublicKey(publicKey);
  const decoratedSignature = new xdr.DecoratedSignature({
    hint: keyPair.signatureHint(),
    signature: result.signature,
  });
  transaction.signatures.push(decoratedSignature);

  return transaction;
};
