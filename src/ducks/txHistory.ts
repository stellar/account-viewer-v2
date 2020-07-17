import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import StellarSdk from "stellar-sdk";
import { ActionStatus } from "./account";

export const fetchTxHistoryThunk = createAsyncThunk<
  Array<Types.Payment>,
  string,
  { rejectValue: RejectMessage }
>("txHistory", async (publicKey, { rejectWithValue }) => {
  const dataProvider = new DataProvider({
    serverUrl: "https://horizon-testnet.stellar.org",
    accountOrKey: publicKey,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });
  let payments: Array<Types.Payment> | null = null;
  try {
    payments = (await dataProvider.fetchPayments())?.records;
  } catch (error) {
    return rejectWithValue({
      errorMessage: error.response?.detail || error.toString(),
    });
  }
  return payments;
});

interface RejectMessage {
  errorMessage: string;
}

interface InitialTxHistoryState {
  data: Array<Types.Payment>;
  errorMessage?: string;
  status: ActionStatus | undefined;
}

const initialTxHistoryState: InitialTxHistoryState = {
  data: [],
  errorMessage: undefined,
  status: undefined,
};

export const txHistorySlice = createSlice({
  name: "txHistory",
  initialState: initialTxHistoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTxHistoryThunk.pending, (state) => ({
      ...state,
      data: [],
      status: ActionStatus.PENDING,
    }));
    builder.addCase(fetchTxHistoryThunk.fulfilled, (state, action) => ({
      ...state,
      data: action.payload,
      status: ActionStatus.SUCCESS,
    }));
    builder.addCase(fetchTxHistoryThunk.rejected, (state, action) => ({
      ...state,
      data: [],
      status: ActionStatus.ERROR,
      errorMessage: action.payload?.errorMessage,
    }));
  },
});

export const { reducer } = txHistorySlice;
