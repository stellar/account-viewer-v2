import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MemoType, MemoValue, Horizon } from "stellar-sdk";
import BigNumber from "bignumber.js";
import { getErrorString } from "helpers/getErrorString";
import { submitPaymentTransaction } from "helpers/submitPaymentTransaction";
import { ActionStatus, RejectMessage } from "constants/types.d";
import { RootState } from "config/store";

export interface PaymentTransactionParams {
  publicKey: string;
  toAccountId: string;
  amount: BigNumber;
  fee: number;
  memoType: MemoType;
  memoContent: MemoValue;
}

export const sendTxAction = createAsyncThunk<
  Horizon.TransactionResponse,
  PaymentTransactionParams,
  { rejectValue: RejectMessage; state: RootState }
>("sendTxAction", async (params, { rejectWithValue }) => {
  let result;
  try {
    result = await submitPaymentTransaction(params);
  } catch (error) {
    return rejectWithValue({
      errorString: getErrorString(error),
    });
  }

  return result;
});

interface InitialState {
  data: Horizon.TransactionResponse | null;
  status: ActionStatus | undefined;
  errorString?: string;
}

const initialState: InitialState = {
  data: null,
  status: undefined,
  errorString: undefined,
};

const sendTxSlice = createSlice({
  name: "sendTx",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendTxAction.pending, (state) => ({
      ...state,
      status: ActionStatus.PENDING,
    }));
    builder.addCase(sendTxAction.fulfilled, (state, action) => ({
      ...state,
      data: action.payload,
      status: ActionStatus.SUCCESS,
    }));
    builder.addCase(sendTxAction.rejected, (state, action) => ({
      ...state,
      data: null,
      status: ActionStatus.ERROR,
      errorString: action.payload?.errorString,
    }));
  },
});

export const { reducer } = sendTxSlice;
