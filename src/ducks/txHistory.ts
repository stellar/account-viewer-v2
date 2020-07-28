import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { ActionStatus, RejectMessage } from "constants/types.d";
import { settingsSelector } from "ducks/settings";
import { RootState } from "config/store";

export const fetchTxHistoryAction = createAsyncThunk<
  Array<Types.Payment>,
  string,
  { rejectValue: RejectMessage; state: RootState }
>("txHistoryAction", async (publicKey, { rejectWithValue, getState }) => {
  const { isTestnet } = settingsSelector(getState());

  const dataProvider = new DataProvider({
    serverUrl: getNetworkConfig(isTestnet).url,
    accountOrKey: publicKey,
    networkPassphrase: getNetworkConfig(isTestnet).network,
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
    builder.addCase(fetchTxHistoryAction.pending, (state) => ({
      ...state,
      data: [],
      status: ActionStatus.PENDING,
    }));
    builder.addCase(fetchTxHistoryAction.fulfilled, (state, action) => ({
      ...state,
      data: action.payload,
      status: ActionStatus.SUCCESS,
    }));
    builder.addCase(fetchTxHistoryAction.rejected, (state, action) => ({
      ...state,
      data: [],
      status: ActionStatus.ERROR,
      errorMessage: action.payload?.errorMessage,
    }));
  },
});

export const { reducer } = txHistorySlice;
