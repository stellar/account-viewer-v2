import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// @types/trezor-connect doesn't have .stellarGetAddress()
// @ts-ignore
import TrezorConnect from "trezor-connect";

export const fetchTrezorStellarAddressAction = createAsyncThunk<
  // Return type of the payload creator
  string,
  // First argument to the payload creator
  undefined,
  // Types for ThunkAPI
  { rejectValue: RejectMessage }
>(
  "walletTrezor/fetchTrezorStellarAddressAction",
  async (_, { rejectWithValue }) => {
    try {
      const trezorResponse = await TrezorConnect.stellarGetAddress({
        path: "m/44'/148'/0'",
      });

      if (!trezorResponse.success) {
        const errorMessage = trezorResponse.payload?.error
          ? `Couldn't connect to your Trezor device: ${trezorResponse.payload?.error}`
          : "Couldn't connect to your Trezor device, please try again.";

        return rejectWithValue({
          errorMessage,
        });
      }

      return trezorResponse.payload.address;
    } catch (error) {
      return rejectWithValue({
        errorMessage: error.toString(),
      });
    }
  },
);

interface RejectMessage {
  errorMessage: string;
}

export enum ActionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface InitialState {
  data: string | null;
  status: ActionStatus | undefined;
  errorMessage?: string;
}

const initialState: InitialState = {
  data: null,
  status: undefined,
  errorMessage: undefined,
};

const walletTrezorSlice = createSlice({
  name: "walletTrezor",
  initialState,
  reducers: {
    reset: () => initialState,
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
        errorMessage: action.payload?.errorMessage,
      }),
    );
  },
});

export const { reducer, actions } = walletTrezorSlice;
