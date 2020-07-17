import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import StellarSdk from "stellar-sdk";

export const fetchAccountAction = createAsyncThunk<
  // Return type of the payload creator
  Types.AccountDetails,
  // First argument to the payload creator
  string,
  // Types for ThunkAPI
  { rejectValue: RejectMessage }
>("account/fetchAccountAction", async (publicKey, { rejectWithValue }) => {
  const dataProvider = new DataProvider({
    // TODO: move to config (support mainnet and testnet)
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
  isAuthenticated: boolean;
  status: ActionStatus | undefined;
  errorMessage?: string;
}

const initialState: InitialState = {
  data: null,
  isAuthenticated: false,
  status: undefined,
  errorMessage: undefined,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccountAction.pending, (state) => ({
      ...state,
      status: ActionStatus.PENDING,
    }));

    builder.addCase(fetchAccountAction.fulfilled, (state, action) => ({
      ...state,
      data: { ...action.payload },
      status: ActionStatus.SUCCESS,
      // If something went wrong, action.payload could be null. Just making
      // sure we have the response data to set isAuthenticated correctly.
      isAuthenticated: !!action.payload,
    }));

    builder.addCase(fetchAccountAction.rejected, (state, action) => ({
      ...state,
      data: null,
      status: ActionStatus.ERROR,
      errorMessage: action.payload?.errorMessage,
    }));
  },
});

export const { reducer } = accountSlice;
