import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import { RootState } from "config/store";
import { settingsSelector } from "ducks/settings";
import { getClaimableBalances } from "helpers/getClaimableBalances";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import {
  ActionStatus,
  RejectMessage,
  ClaimableBalancesInitialState,
  ClaimableBalance,
} from "types/types";

export const fetchClaimableBalancesAction = createAsyncThunk<
  {
    data: ClaimableBalance[];
  },
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "claimableBalances/fetchClaimableBalancesAction",
  async (publicKey, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());
    const networkConfig = getNetworkConfig(isTestnet);
    const server = new StellarSdk.Server(networkConfig.url);

    let data: ClaimableBalance[] = [];

    try {
      data = await getClaimableBalances({ server, publicKey });
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

const initialClaimableBalancesState: ClaimableBalancesInitialState = {
  data: [],
  errorString: undefined,
  status: undefined,
};

export const claimableBalancesSlice = createSlice({
  name: "claimableBalances",
  initialState: initialClaimableBalancesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchClaimableBalancesAction.pending, (state) => {
      state.status = ActionStatus.PENDING;
      state.errorString = undefined;
    });
    builder.addCase(fetchClaimableBalancesAction.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(fetchClaimableBalancesAction.rejected, (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload?.errorString;
    });
  },
});

export const claimableBalancesSelector = (state: RootState) =>
  state.claimableBalances;

export const { reducer } = claimableBalancesSlice;
