import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import albedo from "@albedo-link/intent";
import { getCatchError } from "@stellar/frontend-helpers";

import { ActionStatus, RejectMessage, WalletInitialState } from "types/types";

export const fetchAlbedoStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  undefined,
  { rejectValue: RejectMessage }
>(
  "walletAlbedo/fetchAlbedoStellarAddressAction",
  async (_, { rejectWithValue }) => {
    try {
      const albedoResponse = await albedo.publicKey();

      return { publicKey: albedoResponse.pubkey };
    } catch (e) {
      const error = getCatchError(e);
      return rejectWithValue({
        errorString: error.message || error.toString(),
      });
    }
  },
);

const initialState: WalletInitialState = {
  data: null,
  status: undefined,
  errorString: undefined,
};

const walletAlbedoSlice = createSlice({
  name: "walletAlbedo",
  initialState,
  reducers: {
    resetAlbedoAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAlbedoStellarAddressAction.pending,
      (state = initialState) => {
        state.status = ActionStatus.PENDING;
      },
    );

    builder.addCase(
      fetchAlbedoStellarAddressAction.fulfilled,
      (state, action) => {
        state.data = action.payload;
        state.status = ActionStatus.SUCCESS;
      },
    );

    builder.addCase(
      fetchAlbedoStellarAddressAction.rejected,
      (state, action) => {
        // Do not update state if user has closed modal and left Albedo open
        if (state.status) {
          state.data = null;
          state.status = ActionStatus.ERROR;
          state.errorString = action.payload?.errorString;
        }
      },
    );
  },
});

export const { reducer } = walletAlbedoSlice;
export const { resetAlbedoAction } = walletAlbedoSlice.actions;
