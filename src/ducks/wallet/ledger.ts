import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LedgerApi from "@ledgerhq/hw-app-str";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { ActionStatus, RejectMessage, WalletInitialState } from "types/types.d";

export const fetchLedgerStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  string,
  { rejectValue: RejectMessage }
>(
  "walletLedger/fetchLedgerStellarAddressAction",
  async (bipPath, { rejectWithValue }) => {
    const result = { publicKey: "" };
    try {
      const transport = await TransportWebUSB.create();
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
  reducers: {
    resetLedgerAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchLedgerStellarAddressAction.pending,
      (state = initialState) => {
        state.status = ActionStatus.PENDING;
      },
    );
    builder.addCase(
      fetchLedgerStellarAddressAction.fulfilled,
      (state, action) => {
        state.data = action.payload;
        state.status = ActionStatus.SUCCESS;
      },
    );
    builder.addCase(
      fetchLedgerStellarAddressAction.rejected,
      (state, action) => {
        // Do not update state if user has closed modal and left Ledger tab open
        if (state.status) {
          state.data = null;
          state.status = ActionStatus.ERROR;
          state.errorString = action.payload?.errorString;
        }
      },
    );
  },
});

export const { reducer } = walletLedgerSlice;
export const { resetLedgerAction } = walletLedgerSlice.actions;
