import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  FLAGGED_ACCOUNT_STORAGE_ID,
  FLAGGED_ACCOUNT_DATE_STORAGE_ID,
} from "constants/settings";
import { getFlaggedAccounts } from "helpers/getFlaggedAccounts";
import { ActionStatus, FlaggedAccounts } from "types/types.d";

const initialState: FlaggedAccounts = {
  data: [{ address: "", tags: [""] }],
  status: undefined,
};

export const fetchFlaggedAccountsAction = createAsyncThunk(
  "action/fetchFlaggedAccountsAction",
  async () => {
    let accounts;
    const date = new Date();
    const time = date.getTime();
    const sevenDaysAgo = time - 7 * 24 * 60 * 60 * 1000;
    const flaggedAccountsCacheDate = Number(
      localStorage.getItem(FLAGGED_ACCOUNT_DATE_STORAGE_ID),
    );

    accounts = JSON.parse(
      localStorage.getItem(FLAGGED_ACCOUNT_STORAGE_ID) || "[]",
    );

    // if flaggedAccounts were last cached over seven days ago, make the request
    // flaggedAccountsCacheDate is coerced to 0 if not found in storage
    if (flaggedAccountsCacheDate < sevenDaysAgo) {
      try {
        accounts = await getFlaggedAccounts();
        // store the accounts plus the date we've acquired them
        localStorage.setItem(
          FLAGGED_ACCOUNT_STORAGE_ID,
          JSON.stringify(accounts),
        );
        localStorage.setItem(FLAGGED_ACCOUNT_DATE_STORAGE_ID, time.toString());
      } catch (e) {
        console.error("Flagged account API did not respond");
      }
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
