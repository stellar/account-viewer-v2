import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storePrivateKey, CreateKeyManagerResponse } from "helpers/keyManager";
import { RejectMessage } from "constants/types.d";

export const storePrivateKeyAction = createAsyncThunk<
  CreateKeyManagerResponse,
  string,
  { rejectValue: RejectMessage }
>("keyManagerAction", async (secret: string, { rejectWithValue }) => {
  let result;
  try {
    result = await storePrivateKey(secret);
  } catch (error) {
    return rejectWithValue({
      errorString: error.response?.detail || error.toString(),
    });
  }
  return result;
});

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
    builder.addCase(storePrivateKeyAction.pending, () => ({
      ...initialState,
    }));
    builder.addCase(storePrivateKeyAction.fulfilled, (state, action) => ({
      ...state,
      keyStoreId: action.payload.id,
      password: action.payload.password,
    }));
    builder.addCase(storePrivateKeyAction.rejected, (state, action) => ({
      ...state,
      errorString: action?.payload?.errorString,
    }));
  },
});

export const { reducer } = keyStoreSlice;
