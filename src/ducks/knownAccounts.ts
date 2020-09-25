import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ActionStatus,
  KnownAccount,
  KnownAccountsInitialState,
} from "types/types.d";

export const fetchAccountsAction = createAsyncThunk<KnownAccount[]>(
  "knownAccounts/fetchKnownAccountsAction",
  async () => {
    let result;
    try {
      const response = await fetch(
        "https://api.stellar.expert/explorer/directory?tag[]=memo-required",
      );

      if (response.ok) {
        const data = await response.json();
        result = data?._embedded?.records;
      }
    } catch (error) {
      // Do nothing
    }

    return result;
  },
);

const initialState: KnownAccountsInitialState = {
  data: undefined,
  status: undefined,
};

const knownAccountsSlice = createSlice({
  name: "knownAccounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccountsAction.pending, (state) => {
      state.status = ActionStatus.PENDING;
    });
    builder.addCase(fetchAccountsAction.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(fetchAccountsAction.rejected, (state) => {
      state.status = ActionStatus.ERROR;
    });
  },
});

export const { reducer } = knownAccountsSlice;
