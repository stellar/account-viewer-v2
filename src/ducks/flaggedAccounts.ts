import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCatchError } from "@stellar/frontend-helpers";

import {
  FLAGGED_ACCOUNT_STORAGE_ID,
  FLAGGED_ACCOUNT_DATE_STORAGE_ID,
} from "constants/settings";
import { getFlaggedAccounts } from "helpers/getFlaggedAccounts";
import { getOrSaveLocalStorageData } from "helpers/getOrSaveLocalStorageData";
import { ActionStatus, FlaggedAccounts } from "types/types";

const initialState: FlaggedAccounts = {
  data: [{ address: "", tags: [""] }],
  status: undefined,
};

export const fetchFlaggedAccountsAction = createAsyncThunk(
  "action/fetchFlaggedAccountsAction",
  async () => {
    let accounts;

    try {
      accounts = await getOrSaveLocalStorageData({
        storageId: FLAGGED_ACCOUNT_STORAGE_ID,
        storageDateId: FLAGGED_ACCOUNT_DATE_STORAGE_ID,
        getAccountsFunc: getFlaggedAccounts,
      });
    } catch (e) {
      const error = getCatchError(e);
      console.error(error.message);
    }

    return accounts;
  },
);

const flaggedAccountsSlice = createSlice({
  name: "flaggedAccounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchFlaggedAccountsAction.pending,
      (state = initialState) => {
        state.status = ActionStatus.PENDING;
      },
    );
    builder.addCase(fetchFlaggedAccountsAction.fulfilled, (state, action) => {
      state.status = ActionStatus.SUCCESS;
      state.data = action.payload;
    });
  },
});

export const { reducer } = flaggedAccountsSlice;
