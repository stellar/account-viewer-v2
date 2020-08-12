import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { KeyType } from "@stellar/wallet-sdk";
import { storeKey, CreateKeyManagerResponse } from "helpers/keyManager";
import { getErrorString } from "helpers/getErrorString";
import { RejectMessage } from "constants/types.d";

interface WalletKeyActionProps {
  publicKey: string;
  privateKey?: string;
  keyType: KeyType;
  path?: string;
}

export const storeKeyAction = createAsyncThunk<
  CreateKeyManagerResponse,
  WalletKeyActionProps,
  { rejectValue: RejectMessage }
>(
  "keyStore/storeKeyAction",
  async ({ publicKey, privateKey, keyType, path }, { rejectWithValue }) => {
    let result;
    try {
      result = await storeKey({ publicKey, privateKey, keyType, path });
    } catch (error) {
      return rejectWithValue({
        errorString: getErrorString(error),
      });
    }
    return result;
  },
);

interface KeyStoreInitialState {
  keyStoreId: string;
  password: string;
  errorString?: string;
}

const initialState: KeyStoreInitialState = {
  keyStoreId: "",
  password: "",
  errorString: undefined,
};

const keyStoreSlice = createSlice({
  name: "keyStore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storeKeyAction.pending, () => initialState);
    builder.addCase(storeKeyAction.fulfilled, (state, action) => {
      state.keyStoreId = action.payload.id;
      state.password = action.payload.password;
    });
    builder.addCase(storeKeyAction.rejected, (state, action) => {
      state.errorString = action?.payload?.errorString;
    });
  },
});

export const { reducer } = keyStoreSlice;
