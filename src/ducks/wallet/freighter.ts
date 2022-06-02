import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPublicKey } from "@stellar/freighter-api";
import { getCatchError } from "@stellar/frontend-helpers";

import { ActionStatus, RejectMessage, WalletInitialState } from "types/types";

export const fetchFreighterStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  undefined,
  { rejectValue: RejectMessage }
>(
  "walletFreighter/fetchFreighterStellarAddressAction",
  async (_, { rejectWithValue }) => {
    try {
      const freighterResponse = await getPublicKey();
      return { publicKey: freighterResponse };
    } catch (e) {
      const error = getCatchError(e);
      return rejectWithValue({
        errorString: error.toString(),
      });
    }
  },
);

const initialState: WalletInitialState = {
  data: null,
  status: undefined,
  errorString: undefined,
};

const walletFreighterSlice = createSlice({
  name: "walletFreighter",
  initialState,
  reducers: {
    resetFreighterAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchFreighterStellarAddressAction.pending,
      (state = initialState) => {
        state.status = ActionStatus.PENDING;
      },
    );

    builder.addCase(
      fetchFreighterStellarAddressAction.fulfilled,
      (state, action) => {
        state.data = action.payload;
        state.status = ActionStatus.SUCCESS;
      },
    );

    builder.addCase(
      fetchFreighterStellarAddressAction.rejected,
      (state, action) => {
        // Do not update state if user has closed modal and left Freighter open
        if (state.status) {
          state.data = null;
          state.status = ActionStatus.ERROR;
          state.errorString = action.payload?.errorString;
        }
      },
    );
  },
});

export const { reducer } = walletFreighterSlice;
export const { resetFreighterAction } = walletFreighterSlice.actions;
