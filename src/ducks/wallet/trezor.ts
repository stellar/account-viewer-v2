import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCatchError } from "@stellar/frontend-helpers";
import TrezorConnect from "@trezor/connect-web";

import { ActionStatus, RejectMessage, WalletInitialState } from "types/types";

export const fetchTrezorStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  string,
  { rejectValue: RejectMessage }
>(
  "walletTrezor/fetchTrezorStellarAddressAction",
  async (bipPath, { rejectWithValue }) => {
    try {
      const trezorResponse = await TrezorConnect.stellarGetAddress({
        path: `m/${bipPath}`,
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

const walletTrezorSlice = createSlice({
  name: "walletTrezor",
  initialState,
  reducers: {
    resetTrezorAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTrezorStellarAddressAction.pending,
      (state = initialState) => {
        state.status = ActionStatus.PENDING;
      },
    );

    builder.addCase(
      fetchTrezorStellarAddressAction.fulfilled,
      (state, action) => {
        state.data = action.payload;
        state.status = ActionStatus.SUCCESS;
      },
    );

    builder.addCase(
      fetchTrezorStellarAddressAction.rejected,
      (state, action) => {
        // Do not update state if user has closed modal and left Trezor tab open
        if (state.status) {
          state.data = null;
          state.status = ActionStatus.ERROR;
          state.errorString = action.payload?.errorString;
        }
      },
    );
  },
});

export const { reducer } = walletTrezorSlice;
export const { resetTrezorAction } = walletTrezorSlice.actions;
