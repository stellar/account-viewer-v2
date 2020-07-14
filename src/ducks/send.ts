import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import BigNumber from "bignumber.js";
import { ActionStatus } from "./account";

// TODO - network constant config
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

export const sendTransaction = createAsyncThunk<
  any,
  { secret: string; toAccountId: string; amount: BigNumber; fee: number },
  { rejectValue: RejectMessage }
>(
  "sendTransaction",
  async ({ secret, toAccountId, amount, fee }, { rejectWithValue }) => {
    let result;

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
    } catch (error) {
      return rejectWithValue({
        errorMessage: error.response?.detail || error.toString(),
      });
    }

    return result;
  },
);

interface RejectMessage {
  errorMessage: string;
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
    builder.addCase(sendTransaction.pending, (state) => ({
      ...state,
      status: ActionStatus.PENDING,
    }));
    builder.addCase(sendTransaction.fulfilled, (state, action) => ({
      ...state,
      data: action.payload,
      status: ActionStatus.SUCCESS,
    }));
    builder.addCase(sendTransaction.rejected, (state, action) => ({
      ...state,
      data: null,
      status: ActionStatus.ERROR,
      errorMessage: action.payload?.errorMessage,
    }));
  },
});

export const { reducer } = sendTxSlice;
