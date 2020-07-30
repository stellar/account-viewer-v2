import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { ActionStatus, RejectMessage } from "constants/types.d";
import { TX_HISTORY_LIMIT } from "constants/settings";
import { settingsSelector } from "ducks/settings";
import { RootState } from "config/store";

let txHistoryWatcherStopper: any;

export const fetchTxHistoryAction = createAsyncThunk<
  {
    data: Array<Types.Payment>;
    hasMoreTxs: boolean;
  },
  string,
  { rejectValue: RejectMessage; state: RootState }
>("txHistoryAction", async (publicKey, { rejectWithValue, getState }) => {
  const { isTestnet } = settingsSelector(getState());

  const dataProvider = new DataProvider({
    serverUrl: getNetworkConfig(isTestnet).url,
    accountOrKey: publicKey,
    networkPassphrase: getNetworkConfig(isTestnet).network,
  });
  let data: Array<Types.Payment> | null = null;
  let hasMoreTxs = false;

  try {
    const transactions = await dataProvider.fetchPayments({
      limit: TX_HISTORY_LIMIT,
    });
    hasMoreTxs = (await transactions.next())?.records.length > 0;
    data = transactions?.records;
  } catch (error) {
    return rejectWithValue({
      errorString: error.response?.detail || error.toString(),
    });
  }

  return {
    data,
    hasMoreTxs,
  };
});

export const startTxHistoryWatcherAction = createAsyncThunk<
  boolean,
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "txHistoryWatcherAction",
  (publicKey, { rejectWithValue, getState, dispatch }) => {
    try {
      const { isTestnet } = settingsSelector(getState());
      const { data } = txHistorySelector(getState());

      const dataProvider = new DataProvider({
        serverUrl: getNetworkConfig(isTestnet).url,
        accountOrKey: publicKey,
        networkPassphrase: getNetworkConfig(isTestnet).network,
      });

      txHistoryWatcherStopper = dataProvider.watchPayments({
        onMessage: (payment: Types.Payment) => {
          // Update only if there are newer transactions
          if (!data[0] || payment.timestamp > data[0]?.timestamp) {
            dispatch(updateTxHistoryAction(payment));
          }
        },
        onError: (error) => {
          const errorString =
            error?.toString() || "We couldn't update your payments history";
          dispatch(updateTxHistoryErrorAction({ errorString, data }));
        },
      });

      return true;
    } catch (error) {
      return rejectWithValue({
        errorString: error.response?.detail || error.toString(),
      });
    }
  },
);

interface InitialTxHistoryState {
  data: Array<Types.Payment>;
  hasMoreTxs?: boolean;
  isTxWatcherStarted: boolean;
  errorString?: string;
  status: ActionStatus | undefined;
}

const initialTxHistoryState: InitialTxHistoryState = {
  data: [],
  hasMoreTxs: false,
  isTxWatcherStarted: false,
  errorString: undefined,
  status: undefined,
};

export const txHistorySlice = createSlice({
  name: "txHistory",
  initialState: initialTxHistoryState,
  reducers: {
    updateTxHistoryAction: (state, action) => ({
      ...state,
      data: [action.payload, ...state.data],
    }),
    updateTxHistoryErrorAction: (state, action) => ({
      ...state,
      // TODO: temp solution to pass "data" until BigNumber issue is fixed
      data: action.payload.data,
      status: ActionStatus.ERROR,
      errorString: action.payload.errorString,
    }),
    stopTxHistoryWatcherAction: () => {
      if (txHistoryWatcherStopper) {
        txHistoryWatcherStopper();
      }

      return initialTxHistoryState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTxHistoryAction.pending, (state) => ({
      ...state,
      data: [],
      status: ActionStatus.PENDING,
    }));
    builder.addCase(fetchTxHistoryAction.fulfilled, (state, action) => ({
      ...state,
      data: action.payload.data,
      hasMoreTxs: action.payload.hasMoreTxs,
      status: ActionStatus.SUCCESS,
    }));
    builder.addCase(fetchTxHistoryAction.rejected, (state, action) => ({
      ...state,
      data: [],
      status: ActionStatus.ERROR,
      errorString: action.payload?.errorString,
    }));

    // TODO: figure out why it breaks for BigNumber amount
    // @ts-ignore
    builder.addCase(startTxHistoryWatcherAction.fulfilled, (state, action) => ({
      ...state,
      isTxWatcherStarted: action.payload,
    }));

    // @ts-ignore
    builder.addCase(startTxHistoryWatcherAction.rejected, (state, action) => ({
      ...state,
      status: ActionStatus.ERROR,
      errorString: action.payload?.errorString,
    }));
  },
});

export const txHistorySelector = (state: RootState) => state.txHistory;

export const { reducer } = txHistorySlice;
export const {
  updateTxHistoryAction,
  updateTxHistoryErrorAction,
  stopTxHistoryWatcherAction,
} = txHistorySlice.actions;
