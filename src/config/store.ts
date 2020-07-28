import {
  configureStore,
  getDefaultMiddleware,
  isPlain,
} from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";
import BigNumber from "bignumber.js";

import { reducer as account } from "ducks/account";
import { reducer as keyStore } from "ducks/keyStore";
import { reducer as sendTx } from "ducks/sendTransaction";
import { reducer as settings } from "ducks/settings";
import { reducer as txHistory } from "ducks/txHistory";
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

export const store = configureStore({
  reducer: combineReducers({
    account,
    keyStore,
    sendTx,
    settings,
    txHistory,
    walletTrezor,
  }),
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        isSerializable,
      },
    }),
    loggerMiddleware,
  ],
});
