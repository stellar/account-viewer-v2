import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCatchError } from "@stellar/frontend-helpers";
import {
  MEMO_REQ_ACCOUNT_STORAGE_ID,
  MEMO_REQ_ACCOUNT_DATE_STORAGE_ID,
} from "constants/settings";
import { getMemoRequiredAccounts } from "helpers/getMemoRequiredAccounts";
import { getOrSaveLocalStorageData } from "helpers/getOrSaveLocalStorageData";
import {
  ActionStatus,
  MemoRequiredAccountsInitialState,
  MemoRequiredAccountsResponse,
  AnyObject,
} from "types/types";

export const fetchMemoRequiredAccountsAction = createAsyncThunk<
  MemoRequiredAccountsResponse | AnyObject
>("memoRequiredAccounts/fetchMemoRequiredAccountsAction", async () => {
  let result;
  try {
    result = await getOrSaveLocalStorageData<MemoRequiredAccountsResponse>({
      storageId: MEMO_REQ_ACCOUNT_STORAGE_ID,
      storageDateId: MEMO_REQ_ACCOUNT_DATE_STORAGE_ID,
      getAccountsFunc: getMemoRequiredAccounts,
    });
  } catch (e) {
    const error = getCatchError(e);
    console.error(error.message);
  }

  return result || {};
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
