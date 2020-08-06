import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TrezorConnect from "trezor-connect";

import {
  ActionStatus,
  RejectMessage,
  WalletInitialState,
} from "constants/types.d";

export const fetchTrezorStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  undefined,
  { rejectValue: RejectMessage }
>(
  "walletTrezor/fetchTrezorStellarAddressAction",
  async (_, { rejectWithValue }) => {
    try {
      // @ts-ignore @types/trezor-connect doesn't have stellarGetAddress()
      const trezorResponse = await TrezorConnect.stellarGetAddress({
        path: "m/44'/148'/0'",
      });

      if (!trezorResponse.success) {
        const errorString = trezorResponse.payload?.error
          ? `Couldn't connect to your Trezor device: ${trezorResponse.payload?.error}`
          : "Couldn't connect to your Trezor device, please try again.";

        return rejectWithValue({
          errorString,
        });
      }

      return { publicKey: trezorResponse.payload.address };
    } catch (error) {
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

const walletTrezorSlice = createSlice({
  name: "walletTrezor",
  initialState,
  reducers: {
    resetTrezorAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrezorStellarAddressAction.pending, (state) => ({
      ...state,
      data: null,
      status: ActionStatus.PENDING,
    }));

    builder.addCase(
      fetchTrezorStellarAddressAction.fulfilled,
      (state, action) => ({
        ...state,
        data: action.payload,
        status: ActionStatus.SUCCESS,
      }),
    );

    builder.addCase(
      fetchTrezorStellarAddressAction.rejected,
      (state, action) => ({
        ...state,
        data: null,
        status: ActionStatus.ERROR,
        errorString: action.payload?.errorString,
      }),
    );
  },
});

export const { reducer } = walletTrezorSlice;
export const { resetTrezorAction } = walletTrezorSlice.actions;
