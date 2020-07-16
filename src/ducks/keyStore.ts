import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { KeyManager } from "@stellar/wallet-sdk";
import { createKeyManager, CreateKeyManagerResponse } from "helpers/keyManager";

export const storePrivateKey = createAsyncThunk<
  CreateKeyManagerResponse,
  string,
  { rejectValue: RejectMessage }
>("keyManagerThunk", async (secret: string, { rejectWithValue }) => {
  let result;
  try {
    result = await createKeyManager(secret);
  } catch (error) {
    return rejectWithValue({
      errorMessage: error.response?.detail || error.toString(),
    });
  }
  return result;
});

interface RejectMessage {
  errorMessage: string;
}

interface InitialState {
  keyManager?: typeof KeyManager;
  id: string;
  password: string;
  errorMessage?: string;
}

const initialState: InitialState = {
  keyManager: undefined,
  id: "",
  password: "",
  errorMessage: undefined,
};

const keyStoreSlice = createSlice({
  name: "keyStore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storePrivateKey.fulfilled, (state, action) => ({
      ...state,
      keyManager: action.payload.keyManager,
      id: action.payload.id,
      password: action.payload.password,
    }));
    builder.addCase(storePrivateKey.rejected, (state, action) => ({
      ...state,
      errorMessage: action?.payload?.errorMessage,
    }));
  },
});

export const { reducer } = keyStoreSlice;
