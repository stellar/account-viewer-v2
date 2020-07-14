import { createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import StellarSdk from "stellar-sdk";
import { AppDispatch } from "App";

interface InitialTxHistoryState {
  data: Array<Types.Payment>;
  error?: string;
  loading: boolean;
}

const initialTxHistoryState: InitialTxHistoryState = {
  data: [],
  error: undefined,
  loading: false,
};

export const txHistorySlice = createSlice({
  name: "txHistory",
  initialState: initialTxHistoryState,
  reducers: {
    txHistoryPending: (state: any) => ({ ...state, loading: true }),
    txHistorySuccess: (state: any, action) => ({
      ...state,
      loading: false,
      records: action.payload,
    }),
    txHistoryFail: (state: any, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
});

// TODO - make thunk methods consistent (eg. use createAsyncChunk or not)
// leaving like this to compare
export const fetchAccountTxHistory = (accountId: string) => async (
  dispatch: AppDispatch,
) => {
  dispatch(txHistorySlice.actions.txHistoryPending());
  const dataProvider = new DataProvider({
    serverUrl: "https://horizon-testnet.stellar.org",
    accountOrKey: accountId,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });
  let payments: Array<Types.Payment> | null = null;
  try {
    payments = (await dataProvider.fetchPayments())?.records;
  } catch (err) {
    return dispatch(txHistorySlice.actions.txHistoryFail(payments));
  }
  return dispatch(txHistorySlice.actions.txHistorySuccess(payments));
};

export const { reducer } = txHistorySlice;
