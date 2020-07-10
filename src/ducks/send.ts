import { createReducer, createAction } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";

// ALEC TODO - Move this elsewhere probably
const account = "";
const secret = "";

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const keypair = StellarSdk.Keypair.fromSecret(secret);

const getAccountSequence = async (accPubKey: string) => {
  const account = await server.loadAccount(accPubKey);
  return account.sequence;
};

export const transactionSend = (formData: any) => {
  return async (dispatch: any) => {
    dispatch(sendStart());

    const source = await new StellarSdk.Account(
      keypair.publicKey(),
      await getAccountSequence(account),
    );

    const transaction = new StellarSdk.TransactionBuilder(source, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: formData.account,
          amount: formData.amount.toString(),
          asset: StellarSdk.Asset.native(),
        }),
      )
      .setTimeout(30)
      .build();

    transaction.sign(StellarSdk.Keypair.fromSecret(secret));
    return server.submitTransaction(transaction);
  };
};

const sendStart = createAction("SEND_START");
const sendEnd = createAction("SEND_END");

const initData = {
  sending: false,
};

export const sendReducer = createReducer(initData, {
  // ALEC TODO - give correct types
  [sendStart.type]: (state: any) => ({
    ...state,
    sending: true,
  }),
  [sendEnd.type]: (state) => ({
    ...state,
    sending: false,
  }),
});
