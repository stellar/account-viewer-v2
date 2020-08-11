import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPublicKey } from "@stellar/lyra-api";

import {
  ActionStatus,
  RejectMessage,
  WalletInitialState,
} from "constants/types.d";

export const fetchLyraStellarAddressAction = createAsyncThunk<
  { publicKey: string },
  undefined,
  { rejectValue: RejectMessage }
>(
  "walletLyra/fetchLyraStellarAddressAction",
  async (_, { rejectWithValue }) => {
    try {
      const lyraResponse = await getPublicKey();

      if (lyraResponse.error) {
        return rejectWithValue({
          errorString: lyraResponse.error,
        });
      }

      return { publicKey: lyraResponse.publicKey };
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

const walletLyraSlice = createSlice({
  name: "walletLyra",
  initialState,
  reducers: {
    resetLyraAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLyraStellarAddressAction.pending, () => ({
      ...initialState,
      status: ActionStatus.PENDING,
    }));

    builder.addCase(
      fetchLyraStellarAddressAction.fulfilled,
      (state, action) => ({
        ...state,
        data: action.payload,
        status: ActionStatus.SUCCESS,
      }),
    );

    builder.addCase(
      fetchLyraStellarAddressAction.rejected,
      (state, action) => ({
        ...state,
        data: null,
        status: ActionStatus.ERROR,
        errorString: action.payload?.errorString,
      }),
    );
  },
});

export const { reducer } = walletLyraSlice;
export const { resetLyraAction } = walletLyraSlice.actions;
