import { createSlice } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import BigNumber from "bignumber.js";
import { ActionStatus } from "./account";
// TODO - adding to package.json gives weird error

// TODO - network constant config
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

export const sendTransaction = (
  secret: string,
  toAccountId: string,
  amount: BigNumber,
  fee: number,
) => 
  // TODO - make type AppDispatch when added
   async (dispatch: any) => {
    dispatch(sendTxSlice.actions.sendTxPending());

    let result;
    // ALEC TODO - test edge cases of inputs. Does SDK give user-friendly UI responses?
    try {
      const keypair = StellarSdk.Keypair.fromSecret(secret);

      const sequence = (await server.loadAccount(keypair.publicKey())).sequence;
      const source = await new StellarSdk.Account(
        keypair.publicKey(),
        sequence,
      );

      const transaction = new StellarSdk.TransactionBuilder(source, {
        fee,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: toAccountId,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
          }),
        )
        .setTimeout(StellarSdk.TimeoutInfinite)
        .build();

      transaction.sign(StellarSdk.Keypair.fromSecret(secret));
      result = await server.submitTransaction(transaction);
    } catch (err) {
      dispatch(sendTxSlice.actions.sendTxFail(err));
    }

    // ALEC TODO - remove "return"?
    return dispatch(sendTxSlice.actions.sendTxSuccess(result));
  }
;

interface InitialState {
  data: any;
  status: ActionStatus | undefined;
  errorMessage?: string;
}

const initialState: InitialState = {
  data: null,
  status: undefined,
  errorMessage: undefined,
};

const sendTxSlice = createSlice({
  name: "sendTx",
  initialState,
  reducers: {
    sendTxPending: (state: any) => ({ ...state, status: ActionStatus.PENDING }),
    sendTxSuccess: (state: any, action) => ({
      ...state,
      status: ActionStatus.SUCCESS,
      data: action.payload,
    }),
    sendTxFail: (state: any, action) => ({
      ...state,
      status: ActionStatus.ERROR,
      errorMessage: action.payload,
    }),
  },
});

export const { reducer } = sendTxSlice;
