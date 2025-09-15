import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LedgerApi from "@ledgerhq/hw-app-str";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { getCatchError } from "@stellar/frontend-helpers";
import { ActionStatus, RejectMessage, WalletInitialState } from "types/types";

export const fetchLedgerStellarAddressAction = createAsyncThunk<
  { publicKey: string; bipPath: string },
  { ledgerBipPath: string; transport: TransportWebHID },
  { rejectValue: RejectMessage }
>(
  "walletLedger/fetchLedgerStellarAddressAction",
  async ({ ledgerBipPath, transport }, { rejectWithValue }) => {
    const result = { publicKey: "", bipPath: ledgerBipPath };
    try {
      const ledgerApi = new LedgerApi(transport);
      const response = await ledgerApi.getPublicKey(ledgerBipPath);
      result.publicKey = response.publicKey;
    } catch (e) {
      const error = getCatchError(e);
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
