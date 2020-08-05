import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ActionStatus, RejectMessage } from "constants/types.d";
import LedgerTransport from "@ledgerhq/hw-transport-u2f";
import LedgerApi from "@ledgerhq/hw-app-str";

// ALEC TODO - types
export const fetchLedgerStellarAddressAction = createAsyncThunk<
  any,
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

interface InitialState {
  data: null | string;
  status?: string;
  errorString?: string;
}

const initialState: InitialState = {
  data: null,
  status: undefined,
  errorString: undefined,
};

const walletLedgerSlice = createSlice({
  name: "walletLedger",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLedgerStellarAddressAction.pending, (state) => ({
      ...state,
      data: null,
      status: ActionStatus.PENDING,
      errorString: undefined,
    }));
    builder.addCase(
      fetchLedgerStellarAddressAction.fulfilled,
      (state, action) => ({
        ...state,
        data: action.payload,
        status: ActionStatus.SUCCESS,
        errorString: undefined,
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
