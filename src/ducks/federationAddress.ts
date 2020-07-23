import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FederationServer } from "stellar-sdk";
import { ActionStatus } from "./account";

interface RejectMessage {
  errorMessage?: string;
}

interface InitialState {
  publicKey?: string;
  status: ActionStatus | undefined;
  errorMessage?: string;
}

const initialState: InitialState = {
  publicKey: undefined,
  status: undefined,
  errorMessage: undefined,
};

export const fetchFederationAddressAction = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectMessage }
>("fetchFederationAddress", async (toAccountId, { rejectWithValue }) => {
  let federationAccountPublicKey;
  try {
    const response = await FederationServer.resolve(toAccountId);
    federationAccountPublicKey = response.account_id;
  } catch (error) {
    return rejectWithValue({
      errorMessage: error.response?.data || error.message,
    });
  }
  return federationAccountPublicKey;
});

export const federationAccountSlice = createSlice({
  name: "federationAddress",
  initialState,
  reducers: {
    resetAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFederationAddressAction.pending, (state) => ({
      ...state,
      status: ActionStatus.PENDING,
      publicKey: undefined,
    }));
    builder.addCase(
      fetchFederationAddressAction.fulfilled,
      (state, action) => ({
        ...state,
        status: ActionStatus.SUCCESS,
        publicKey: action.payload,
      }),
    );
    builder.addCase(fetchFederationAddressAction.rejected, (state, action) => ({
      ...state,
      status: ActionStatus.ERROR,
      // ALEC TODO - check to make sure error returns correctly
      publicKey: undefined,
      errorMessage: action.payload?.errorMessage,
    }));
  },
});

export const { reducer } = federationAccountSlice;
