import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import StellarSdk from "stellar-sdk";

export const fetchAccount = createAsyncThunk<
  // Return type of the payload creator
  Types.AccountDetails,
  // First argument to the payload creator
  string,
  // Types for ThunkAPI
  { rejectValue: RejectMessage }
>("account/fetchAccount", async (publicKey, { rejectWithValue }) => {
  const dataProvider = new DataProvider({
    // TODO: move to config (support mainnet and testnet) (check everywhere)
    serverUrl: "https://horizon-testnet.stellar.org",
    accountOrKey: publicKey,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  let stellarAccount: Types.AccountDetails | null = null;

  try {
    stellarAccount = await dataProvider.fetchAccountDetails();
  } catch (error) {
    return rejectWithValue({
      errorMessage: error.response?.detail || error.toString(),
    });
  }

  return stellarAccount;
});

interface RejectMessage {
  errorMessage: string;
}

export enum ActionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface InitialState {
  data: Types.AccountDetails | null;
  error?: string;
  loading: boolean;
}

const initialState: InitialState = {
  data: null,
  error: undefined,
  loading: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.fulfilled, (state, action) => ({
        ...state,
        data: { ...action.payload },
      }));

    builder.addCase(fetchAccount.rejected, (state, action) => ({
        ...state,
        error: action.payload?.errorMessage,
      }));
  },
});

export const { reducer } = accountSlice;
