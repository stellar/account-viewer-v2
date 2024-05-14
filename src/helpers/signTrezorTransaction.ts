import TrezorConnect from "@trezor/connect-web";
import transformTransaction from "@trezor/connect-plugin-stellar";
import { Transaction } from "@stellar/stellar-sdk";

export const signTrezorTransaction = async (
  transaction: Transaction,
  publicKey: string,
  bipPath: string,
) => {
  TrezorConnect.manifest({
    email: "accounts+trezor@stellar.org",
    appUrl: "https://accountviewer.stellar.org/",
  });

  const path = bipPath || "44'/148'/0'";
  const trezorParams = transformTransaction(`m/${path}`, transaction);
  // @ts-ignore
  // Trezor memo returns number for type
  const response = await TrezorConnect.stellarSignTransaction(trezorParams);

  if (response.success) {
    const signature = Buffer.from(response.payload.signature, "hex").toString(
      "base64",
    );
    transaction.addSignature(publicKey, signature);

    return transaction;
  }

  throw new Error(
    response.payload?.error || "We couldn’t sign the transaction with Trezor.",
  );
};
