import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletSdk } from "@stellar/typescript-wallet-sdk";
import { RootState } from "config/store";
import { TX_HISTORY_LIMIT } from "constants/settings";
import { settingsSelector } from "ducks/settings";
import { getErrorString } from "helpers/getErrorString";
import { makeDisplayablePayments } from "helpers/makeDisplayablePayments";
import {
  ActionStatus,
  Payment,
  PaymentOperation,
  RejectMessage,
  TxHistoryInitialState,
} from "types/types";

let txHistoryWatcherStopper: any;

export const fetchTxHistoryAction = createAsyncThunk<
  {
    data: Payment[];
    hasMoreTxs: boolean;
  },
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "txHistory/fetchTxHistoryAction",
  async (publicKey, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());

    const wallet = isTestnet
      ? walletSdk.Wallet.TestNet()
      : walletSdk.Wallet.MainNet();

    let data: Payment[] | null = null;
    let hasMoreTxs = false;

    try {
      const transactions = await wallet.stellar().account().getHistory({
        accountAddress: publicKey,
        limit: TX_HISTORY_LIMIT,
      });

      const displayTransactions = await makeDisplayablePayments(
        publicKey,
        transactions.records as PaymentOperation[],
      );

      hasMoreTxs = (await transactions.next())?.records.length > 0;
      data = displayTransactions;
    } catch (error) {
      return rejectWithValue({
        errorString: getErrorString(error),
      });
    }

    return {
      data,
      hasMoreTxs,
    };
  },
);

// TODO: put back once this is available in TS Wallet SDK
//  export const startTxHistoryWatcherAction = createAsyncThunk<
//   { isTxWatcherStarted: boolean },
//   string,
//   { rejectValue: RejectMessage; state: RootState }
// >(
//   "txHistory/startTxHistoryWatcherAction",
//   (publicKey, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const { isTestnet } = settingsSelector(getState());
//       const { data } = txHistorySelector(getState());

//       const dataProvider = new DataProvider({
//         serverUrl: getNetworkConfig(isTestnet).url,
//         accountOrKey: publicKey,
//         networkPassphrase: getNetworkConfig(isTestnet).network,
//       });

//       txHistoryWatcherStopper = dataProvider.watchPayments({
//         onMessage: (payment: Payment) => {
//           // Update only if there are newer transactions
//           if (!data[0] || payment.timestamp > data[0]?.timestamp) {
//             dispatch(updateTxHistoryAction(payment));
//           }
//         },
//         onError: () => {
//           const isDevelopment = process.env.NODE_ENV === "development";
//           const isOnSameNetwork =
//             (isDevelopment && isTestnet) || (!isDevelopment && !isTestnet);

//           const errorString = isOnSameNetwork
//             ? "We couldn’t update your payments history at this time."
//             : `Payments history cannot be updated because you are using ${
//                 isTestnet ? "TEST" : "PUBLIC"
//               } network in ${isDevelopment ? "DEVELOPMENT" : "PRODUCTION"}.`;

//           dispatch(updateTxHistoryErrorAction({ errorString }));
//         },
//       });

//       return { isTxWatcherStarted: true };
//     } catch (error) {
//       return rejectWithValue({
//         errorString: getErrorString(error),
//       });
//     }
//   },
// );

const initialTxHistoryState: TxHistoryInitialState = {
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
    updateTxHistoryAction: (state, action) => {
      state.data = [action.payload, ...state.data];
    },
    updateTxHistoryErrorAction: (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload.errorString;
    },
    stopTxHistoryWatcherAction: () => {
      if (txHistoryWatcherStopper) {
        txHistoryWatcherStopper.stop();
        txHistoryWatcherStopper = undefined;
      }

      return initialTxHistoryState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTxHistoryAction.pending, (state) => {
      state.status = ActionStatus.PENDING;
      state.errorString = undefined;
    });
    builder.addCase(fetchTxHistoryAction.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.hasMoreTxs = action.payload.hasMoreTxs;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(fetchTxHistoryAction.rejected, (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload?.errorString;
    });

    // builder.addCase(startTxHistoryWatcherAction.fulfilled, (state, action)
    //  => {
    //   state.isTxWatcherStarted = action.payload.isTxWatcherStarted;
    // });
    // builder.addCase(startTxHistoryWatcherAction.rejected, (state, action)
    //  => {
    //   state.status = ActionStatus.ERROR;
    //   state.errorString = action.payload?.errorString;
    // });
  },
});

export const txHistorySelector = (state: RootState) => state.txHistory;

export const { reducer } = txHistorySlice;
export const {
  updateTxHistoryAction,
  updateTxHistoryErrorAction,
  stopTxHistoryWatcherAction,
} = txHistorySlice.actions;
