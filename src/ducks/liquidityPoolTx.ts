import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import { RootState } from "config/store";
import { settingsSelector } from "ducks/settings";
import { getAccountLPTransactions } from "helpers/getAccountLPTransactions";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import {
  ActionStatus,
  RejectMessage,
  LiquidityPoolInitialState,
  LiquidityPoolAccountTransaction,
} from "types/types.d";

export const fetchLiquidityPoolTxAction = createAsyncThunk<
  {
    data: LiquidityPoolAccountTransaction[];
  },
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "liquidityPoolTx/fetchLiquidityPoolTxAction",
  async (publicKey, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());
    const networkConfig = getNetworkConfig(isTestnet);
    const server = new StellarSdk.Server(networkConfig.url);

    let data: LiquidityPoolAccountTransaction[] = [];

    try {
      data = await getAccountLPTransactions({ server, publicKey });
    } catch (error) {
      return rejectWithValue({
        errorString: getErrorString(error),
      });
    }

    return {
      data,
    };
  },
);

const initialLiquidityPoolTxState: LiquidityPoolInitialState = {
  data: [],
  errorString: undefined,
  status: undefined,
};

export const txHistorySlice = createSlice({
  name: "liquidityPoolTx",
  initialState: initialLiquidityPoolTxState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLiquidityPoolTxAction.pending, (state) => {
      state.status = ActionStatus.PENDING;
      state.errorString = undefined;
    });
    builder.addCase(fetchLiquidityPoolTxAction.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(fetchLiquidityPoolTxAction.rejected, (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload?.errorString;
    });
  },
});

export const liquidityPoolTxSelector = (state: RootState) =>
  state.liquidityPoolTx;

export const { reducer } = txHistorySlice;
