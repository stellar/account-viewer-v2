import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import { Landing } from "pages/Landing";
import { SigninSecretKey } from "pages/SigninSecretKey";
import { Dashboard } from "pages/Dashboard";
import { Send } from "pages/Send";
import { PrivateRoute } from "components/PrivateRoute";

import { reducer as account } from "ducks/account";
import { reducer as sendTx } from "ducks/send";
import { reducer as txHistory } from "ducks/txHistory";
import { reducer as keyStore } from "ducks/keyStore";

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

const store = configureStore({
  reducer: combineReducers({
    account,
    sendTx,
    txHistory,
    keyStore,
  }),
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        // Account balances in response are Non-Serializable

        ignoredActions: [
          "account/fetchAccountAction/fulfilled",
          "txHistoryAction/fulfilled",
        ],
        ignoredPaths: ["account.data.balances.native", "txHistory.data"],
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
        <nav>
          <ul>
            <li>
              <Link to="/">Landing</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/send">Send</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>

          <Route exact path="/auth/secretkey">
            <SigninSecretKey />
          </Route>

          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>

          <PrivateRoute exact path="/send">
            <Send />
          </PrivateRoute>

          {/* TODO: add 404 page */}
        </Switch>
      </div>
    </Router>
  </Provider>
);
