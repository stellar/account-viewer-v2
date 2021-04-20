import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  MEMO_REQ_ACCOUNT_STORAGE_ID,
  MEMO_REQ_ACCOUNT_DATE_STORAGE_ID,
} from "constants/settings";
import { getMemoRequiredAccounts } from "helpers/getMemoRequiredAccounts";
import {
  ActionStatus,
  MemoRequiredAccountsInitialState,
  MemoRequiredAccountsResponse,
} from "types/types.d";

export const fetchMemoRequiredAccountsAction = createAsyncThunk<
  MemoRequiredAccountsResponse | {}
>("memoRequiredAccounts/fetchMemoRequiredAccountsAction", async () => {
  let result;

  const date = new Date();
  const time = date.getTime();
  const sevenDaysAgo = time - 7 * 24 * 60 * 60 * 1000;
  const memoRequiredAccountsCacheDate = Number(
    localStorage.getItem(MEMO_REQ_ACCOUNT_DATE_STORAGE_ID),
  );

  result = JSON.parse(
    localStorage.getItem(MEMO_REQ_ACCOUNT_STORAGE_ID) || "[]",
  );

  // if memoRequiredAccounts were last cached over seven days ago,
  // make the request
  // memoRequiredAccountsCacheDate is coerced to 0 if not found in storage
  if (memoRequiredAccountsCacheDate < sevenDaysAgo) {
    try {
      result = await getMemoRequiredAccounts();
      // store the result plus the date we've acquired them
      localStorage.setItem(MEMO_REQ_ACCOUNT_STORAGE_ID, JSON.stringify(result));
      localStorage.setItem(MEMO_REQ_ACCOUNT_DATE_STORAGE_ID, time.toString());
    } catch (e) {
      console.error("Memo required accounts API did not respond");
    }
  }

  return result;
});

const initialState: MemoRequiredAccountsInitialState = {
  data: {},
  status: undefined,
};

const memoRequiredAccountsSlice = createSlice({
  name: "memoRequiredAccounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMemoRequiredAccountsAction.pending, (state) => {
      state.status = ActionStatus.PENDING;
    });
    builder.addCase(
      fetchMemoRequiredAccountsAction.fulfilled,
      (state, action) => {
        state.data = action.payload;
        state.status = ActionStatus.SUCCESS;
      },
    );
    builder.addCase(fetchMemoRequiredAccountsAction.rejected, (state) => {
      state.status = ActionStatus.ERROR;
    });
  },
});

export const { reducer } = memoRequiredAccountsSlice;
