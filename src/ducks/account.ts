import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletSdk } from "@stellar/typescript-wallet-sdk";
import BigNumber from "bignumber.js";

import { RootState } from "config/store";
import { settingsSelector } from "ducks/settings";
import { getErrorString } from "helpers/getErrorString";
import { isAccountFunded } from "helpers/isAccountFunded";
import {
  ActionStatus,
  RejectMessage,
  AccountInitialState,
  AccountDetails,
} from "types/types";

let accountWatcherStopper: any;

interface UnfundedAccount extends AccountDetails {
  id: string;
}

interface FetchAccountActionResponse {
  data: AccountDetails | UnfundedAccount;
  isUnfunded: boolean;
}

const formatAccount = (accountRedord: any) => {
  const formatBalances = accountRedord.balances.reduce((res: any, cur: any) => {
    if (cur.asset_type === "native") {
      const BASE_RESERVE_MIN_COUNT = 2;
      const BASE_RESERVE = 0.5;

      const minimumBalance = new BigNumber(BASE_RESERVE_MIN_COUNT)
        .plus(cur.subentry_count)
        .plus(cur.num_sponsoring)
        .minus(cur.num_sponsored)
        .times(BASE_RESERVE)
        .plus(cur.selling_liabilities);

      const bal = {
        native: {
          available: new BigNumber(cur.balance).minus(cur.selling_liabilities),
          buyingLiabilities: new BigNumber(cur.buying_liabilities),
          minimumBalance,
          sellingLiabilities: new BigNumber(cur.selling_liabilities),
          token: { type: "native", code: "XLM" },
          total: new BigNumber(cur.balance),
        },
      };

      return { ...res, ...bal };
    }

    return res;
  }, {} as any);

  return {
    id: accountRedord.account_id,
    subentryCount: accountRedord.subentry_count,
    sponsoringCount: accountRedord.num_sponsoring,
    sponsoredCount: accountRedord.num_sponsored,
    thresholds: accountRedord.thresholds,
    signers: accountRedord.signers,
    flags: accountRedord.flags,
    balances: formatBalances,
    sequenceNumber: accountRedord.sequence,
  };
};

export const fetchAccountAction = createAsyncThunk<
  FetchAccountActionResponse,
  string,
  { rejectValue: RejectMessage; state: RootState }
>(
  "account/fetchAccountAction",
  async (publicKey, { rejectWithValue, getState }) => {
    const { isTestnet } = settingsSelector(getState());

    const wallet = isTestnet
      ? walletSdk.Wallet.TestNet()
      : walletSdk.Wallet.MainNet();

    let stellarAccount: AccountDetails | null = null;
    let isUnfunded = false;

    try {
      const accountIsFunded = await isAccountFunded(publicKey, isTestnet);

      if (accountIsFunded) {
        const account = await wallet
          .stellar()
          .account()
          .getInfo({ accountAddress: publicKey });

        stellarAccount = formatAccount(account);
      } else {
        stellarAccount = {
          id: publicKey,
        } as UnfundedAccount;
        isUnfunded = true;
      }
    } catch (error) {
      return rejectWithValue({
        errorString: getErrorString(error),
      });
    }

    return { data: stellarAccount, isUnfunded };
  },
);

// TODO: put this back once Wallet SDK adds this watcher
// export const startAccountWatcherAction = createAsyncThunk<
//   { isAccountWatcherStarted: boolean },
//   string,
//   { rejectValue: RejectMessage; state: RootState }
// >(
//   "account/startAccountWatcherAction",
//   (publicKey, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const { isTestnet } = settingsSelector(getState());

//       const dataProvider = new DataProvider({
//         serverUrl: getNetworkConfig(isTestnet).url,
//         accountOrKey: publicKey,
//         networkPassphrase: getNetworkConfig(isTestnet).network,
//       });

//       accountWatcherStopper = dataProvider.watchAccountDetails({
//         onMessage: (accountDetails: Types.AccountDetails) => {
//           dispatch(updateAccountAction(accountDetails));
//         },
//         onError: () => {
//           const errorString =
// "We couldn’t update your account at this time.";
//           dispatch(updateAccountErrorAction({ errorString }));
//         },
//       });

//       return { isAccountWatcherStarted: true };
//     } catch (error) {
//       return rejectWithValue({
//         errorString: getErrorString(error),
//       });
//     }
//   },
// );

const initialState: AccountInitialState = {
  data: null,
  isAuthenticated: false,
  isAccountWatcherStarted: false,
  isUnfunded: false,
  status: undefined,
  errorString: undefined,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    resetAccountAction: () => initialState,
    updateAccountAction: (state, action) => {
      state.data = action.payload;
    },
    updateAccountErrorAction: (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload.errorString;
    },
    stopAccountWatcherAction: () => {
      if (accountWatcherStopper) {
        accountWatcherStopper.stop();
        accountWatcherStopper = undefined;
      }

      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccountAction.pending, (state = initialState) => {
      state.status = ActionStatus.PENDING;
    });
    builder.addCase(fetchAccountAction.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isAuthenticated = !!action.payload;
      state.isUnfunded = action.payload.isUnfunded;
      state.status = ActionStatus.SUCCESS;
    });
    builder.addCase(fetchAccountAction.rejected, (state, action) => {
      state.status = ActionStatus.ERROR;
      state.errorString = action.payload?.errorString;
    });

    // builder.addCase(startAccountWatcherAction.fulfilled, (state, action) => {
    //   state.isAccountWatcherStarted = action.payload.isAccountWatcherStarted;
    // });

    // builder.addCase(startAccountWatcherAction.rejected, (state, action) => {
    //   state.status = ActionStatus.ERROR;
    //   state.errorString = action.payload?.errorString;
    // });
  },
});

export const accountSelector = (state: RootState) => state.account;

export const { reducer } = accountSlice;
export const {
  resetAccountAction,
  updateAccountAction,
  updateAccountErrorAction,
  stopAccountWatcherAction,
} = accountSlice.actions;
