import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { ActionStatus, RejectMessage } from "constants/types.d";
import { settingsSelector } from "ducks/settings";
import { RootState } from "config/store";

export const fetchAccountAction = createAsyncThunk<
  Types.AccountDetails,
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "account/fetchAccountAction",
  async (publicKey, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());

    const dataProvider = new DataProvider({
      serverUrl: getNetworkConfig(isTestnet).url,
      accountOrKey: publicKey,
      networkPassphrase: getNetworkConfig(isTestnet).network,
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
  },
);

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
  reducers: {
    resetAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccountAction.pending, () => ({
      ...initialState,
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
export const { resetAction } = accountSlice.actions;
