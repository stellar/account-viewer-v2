import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { KeyType } from "@stellar/wallet-sdk";
import { storeKey, CreateKeyManagerResponse } from "helpers/keyManager";
import { getErrorString } from "helpers/getErrorString";
import { RejectMessage } from "constants/types.d";

interface WalletKeyActionProps {
  publicKey: string;
  privateKey?: string;
  keyType: KeyType;
}

export const storeKeyAction = createAsyncThunk<
  CreateKeyManagerResponse,
  WalletKeyActionProps,
  { rejectValue: RejectMessage }
>(
  "keyManagerWalletAction",
  async ({ publicKey, privateKey, keyType }, { rejectWithValue }) => {
    let result;
    try {
      result = await storeKey({ publicKey, privateKey, keyType });
    } catch (error) {
      return rejectWithValue({
        errorString: getErrorString(error),
      });
    }
    return result;
  },
);

interface InitialState {
  keyStoreId: string;
  password: string;
  errorString?: string;
}

const initialState: InitialState = {
  keyStoreId: "",
  password: "",
  errorString: undefined,
};

const keyStoreSlice = createSlice({
  name: "keyStore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storeKeyAction.pending, () => ({
      ...initialState,
    }));
    builder.addCase(storeKeyAction.fulfilled, (state, action) => ({
      ...state,
      keyStoreId: action.payload.id,
      password: action.payload.password,
    }));
    builder.addCase(storeKeyAction.rejected, (state, action) => ({
      ...state,
      errorString: action?.payload?.errorString,
    }));
  },
});

export const { reducer } = keyStoreSlice;
