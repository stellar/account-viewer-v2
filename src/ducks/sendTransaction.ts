import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StellarSdk, { Memo } from "stellar-sdk";
import BigNumber from "bignumber.js";
import { ActionStatus } from "./account";

export const sendTxAction = createAsyncThunk<
  any,
  {
    secret: string;
    toAccountId: string;
    amount: BigNumber;
    fee: number;
    memo: Memo;
  },
  { rejectValue: RejectMessage }
>(
  "sendTxAction",
  async ({ secret, toAccountId, amount, fee, memo }, { rejectWithValue }) => {
    let result;

    // TODO - network constant config
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

    try {
      const keypair = StellarSdk.Keypair.fromSecret(secret);
      const sequence = (await server.loadAccount(keypair.publicKey())).sequence;
      const source = await new StellarSdk.Account(
        keypair.publicKey(),
        sequence,
      );

      let transaction = new StellarSdk.TransactionBuilder(source, {
        fee,
        networkPassphrase: StellarSdk.Networks.TESTNET,
        timebounds: await server.fetchTimebounds(100),
      }).addOperation(
        StellarSdk.Operation.payment({
          destination: toAccountId,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        }),
      );

      if (memo.type !== StellarSdk.MemoNone) {
        transaction = transaction.addMemo(memo);
      }

      transaction = transaction.build();

      transaction.sign(keypair);
      result = await server.submitTransaction(transaction);
    } catch (error) {
      return rejectWithValue({
        errorData: error,
      });
    }

    return result;
  },
);

interface RejectMessage {
  // TODO - any
  errorData: any;
}

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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendTxAction.pending, (state) => ({
      ...state,
      status: ActionStatus.PENDING,
    }));
    builder.addCase(sendTxAction.fulfilled, (state, action) => ({
      ...state,
      data: action.payload,
      status: ActionStatus.SUCCESS,
    }));
    builder.addCase(sendTxAction.rejected, (state, action) => ({
      ...state,
      data: null,
      status: ActionStatus.ERROR,
      errorData: action.payload?.errorData,
    }));
  },
});

export const { reducer } = sendTxSlice;
