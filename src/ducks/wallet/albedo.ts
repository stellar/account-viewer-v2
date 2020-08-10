import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import albedo from "@albedo-link/intent";

import {
  ActionStatus,
  RejectMessage,
  WalletInitialState,
} from "constants/types.d";

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
    } catch (error) {
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
    builder.addCase(fetchAlbedoStellarAddressAction.pending, (state) => ({
      ...state,
      data: null,
      status: ActionStatus.PENDING,
    }));

    builder.addCase(
      fetchAlbedoStellarAddressAction.fulfilled,
      (state, action) => ({
        ...state,
        data: action.payload,
        status: ActionStatus.SUCCESS,
      }),
    );

    builder.addCase(
      fetchAlbedoStellarAddressAction.rejected,
      (state, action) => ({
        ...state,
        data: null,
        status: ActionStatus.ERROR,
        errorString: action.payload?.errorString,
      }),
    );
  },
});

export const { reducer } = walletAlbedoSlice;
export const { resetAlbedoAction } = walletAlbedoSlice.actions;
