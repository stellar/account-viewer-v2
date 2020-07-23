import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MemoType, MemoValue, Horizon } from "stellar-sdk";
import BigNumber from "bignumber.js";
import { submitPaymentTransaction } from "helpers/submitPaymentTransaction";
import { ActionStatus } from "./account";

export interface PaymentTransactionParams {
  secret: string;
  toAccountId: string;
  amount: BigNumber;
  fee: number;
  memoType: MemoType;
  memoContent: MemoValue;
}

export const sendTxAction = createAsyncThunk<
  Horizon.TransactionResponse,
  PaymentTransactionParams,
  { rejectValue: RejectMessage }
>("sendTxAction", async (params, { rejectWithValue }) => {
  let result;
  try {
    result = await submitPaymentTransaction(params);
  } catch (error) {
    return rejectWithValue({
      errorData: error.response?.data || { message: error.message },
    });
  }

  return result;
});

type TxErrorResponse = any;

interface RejectMessage {
  errorData: TxErrorResponse;
}

interface InitialState {
  data: Horizon.TransactionResponse | null;
  status: ActionStatus | undefined;
  errorData?: TxErrorResponse;
}

const initialState: InitialState = {
  data: null,
  status: undefined,
  errorData: undefined,
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
      errorData: action.payload?.errorData,
    }));
  },
});

export const { reducer } = sendTxSlice;
