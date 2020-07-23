import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  configureStore,
  getDefaultMiddleware,
  isPlain,
} from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import { Landing } from "pages/Landing";
import { Dashboard } from "pages/Dashboard";
import { PrivateRoute } from "components/PrivateRoute";

import { reducer as account } from "ducks/account";
import { reducer as sendTx } from "ducks/sendTransaction";
import { reducer as txHistory } from "ducks/txHistory";
import { reducer as keyStore } from "ducks/keyStore";
import { reducer as walletTrezor } from "ducks/wallet/trezor";

import BigNumber from "bignumber.js";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
  }
`;

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

const store = configureStore({
  reducer: combineReducers({
    account,
    sendTx,
    txHistory,
    keyStore,
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

export type AppDispatch = typeof store.dispatch;

export const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <GlobalStyle />

        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>

          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>

          {/* TODO: add 404 page */}
        </Switch>
      </div>
    </Router>
  </Provider>
);
