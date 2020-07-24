import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import { getNetworkConfig } from "constants/settings";
import { ActionStatus, RejectMessage } from "constants/types.d";

export const fetchAccountAction = createAsyncThunk<
  // Return type of the payload creator
  Types.AccountDetails,
  // First argument to the payload creator
  string,
  // Types for ThunkAPI
  { rejectValue: RejectMessage }
>("account/fetchAccountAction", async (publicKey, { rejectWithValue }) => {
  const dataProvider = new DataProvider({
    serverUrl: getNetworkConfig().url,
    accountOrKey: publicKey,
    networkPassphrase: getNetworkConfig().network,
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
      data: null,
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
