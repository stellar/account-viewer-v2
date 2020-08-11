import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LedgerTransport from "@ledgerhq/hw-transport-u2f";
import LedgerApi from "@ledgerhq/hw-app-str";

import {
  ActionStatus,
  RejectMessage,
  WalletInitialState,
} from "constants/types.d";

export const fetchLedgerStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  string,
  { rejectValue: RejectMessage }
>(
  "walletLedger/fetchLedgerStellarAddressAction",
  async (bipPath, { rejectWithValue }) => {
    const result = { publicKey: "" };
    try {
      const transport = await LedgerTransport.create();
      const ledgerApi = new LedgerApi(transport);
      const response = await ledgerApi.getPublicKey(bipPath);
      result.publicKey = response.publicKey;
    } catch (error) {
      return rejectWithValue({ errorString: error.toString() });
    }
    return result;
  },
);

const initialState: WalletInitialState = {
  data: null,
  status: undefined,
  errorString: undefined,
};

const walletLedgerSlice = createSlice({
  name: "walletLedger",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLedgerStellarAddressAction.pending, () => ({
      ...initialState,
      status: ActionStatus.PENDING,
    }));
    builder.addCase(
      fetchLedgerStellarAddressAction.fulfilled,
      (state, action) => ({
        ...state,
        data: action.payload,
        status: ActionStatus.SUCCESS,
      }),
    );
    builder.addCase(
      fetchLedgerStellarAddressAction.rejected,
      (state, action) => ({
        ...state,
        data: null,
        status: ActionStatus.ERROR,
        errorString: action.payload?.errorString,
      }),
    );
  },
});

export const { reducer } = walletLedgerSlice;
