import {
  configureStore,
  getDefaultMiddleware,
  isPlain,
  createAction,
  CombinedState,
} from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";
import BigNumber from "bignumber.js";

import { RESET_STORE_ACTION_TYPE } from "constants/settings";

import { reducer as account } from "ducks/account";
import { reducer as keyStore } from "ducks/keyStore";
import { reducer as sendTx } from "ducks/sendTransaction";
import { reducer as settings } from "ducks/settings";
import { reducer as txHistory } from "ducks/txHistory";
import { reducer as walletAlbedo } from "ducks/wallet/albedo";
import { reducer as walletLedger } from "ducks/wallet/ledger";
import { reducer as walletTrezor } from "ducks/wallet/trezor";

export type RootState = ReturnType<typeof store.getState>;

const loggerMiddleware = (store: any) => (next: any) => (
  action: Action<any>,
) => {
  console.log("Dispatching: ", action.type);
  const dispatchedAction = next(action);
  console.log("NEW STATE: ", store.getState());
  return dispatchedAction;
};

const isSerializable = (value: any) =>
  BigNumber.isBigNumber(value) || isPlain(value);

const reducers = combineReducers({
  account,
  keyStore,
  sendTx,
  settings,
  txHistory,
  walletAlbedo,
  walletLedger,
  walletTrezor,
});

export const resetStoreAction = createAction(RESET_STORE_ACTION_TYPE);

const rootReducer = (state: CombinedState<any>, action: Action) => {
  const newState = action.type === RESET_STORE_ACTION_TYPE ? undefined : state;
  return reducers(newState, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        isSerializable,
      },
    }),
    loggerMiddleware,
  ],
});
