import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storePrivateKey, CreateKeyManagerResponse } from "helpers/keyManager";

export const storePrivateKeyThunk = createAsyncThunk<
  CreateKeyManagerResponse,
  string,
  { rejectValue: RejectMessage }
>("keyManagerThunk", async (secret: string, { rejectWithValue }) => {
  let result;
  try {
    result = await storePrivateKey(secret);
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
  id: string;
  password: string;
  errorMessage?: string;
}

const initialState: InitialState = {
  id: "",
  password: "",
  errorMessage: undefined,
};

const keyStoreSlice = createSlice({
  name: "keyStore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storePrivateKeyThunk.pending, () => ({
      ...initialState,
    }));
    builder.addCase(storePrivateKeyThunk.fulfilled, (state, action) => ({
      ...state,
      id: action.payload.id,
      password: action.payload.password,
    }));
    builder.addCase(storePrivateKeyThunk.rejected, (state, action) => ({
      ...state,
      errorMessage: action?.payload?.errorMessage,
    }));
  },
});

export const { reducer } = keyStoreSlice;
