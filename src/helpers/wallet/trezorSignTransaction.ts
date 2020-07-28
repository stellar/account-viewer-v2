import { Transaction } from "stellar-sdk";
// @ts-ignore
import TrezorConnect from "trezor-connect";
import { transformTransaction } from "helpers/wallet/trezorTransformTransaction";

export const trezorSignTransaction = async (transaction: Transaction) => {
  try {
    const params = transformTransaction("m/44'/148'/0'", transaction);
    const response = await TrezorConnect.stellarSignTransaction(params);

    if (response.success) {
      return Buffer.from(response.payload.signature, "hex").toString("base64");
    }

    throw new Error(response.payload.error || "");
  } catch (error) {
    throw new Error(
      `We couldn’t sign the transaction with Trezor. ${error.toString()}.`,
    );
  }
};
