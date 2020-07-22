import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers, Action } from "redux";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import { Landing } from "pages/Landing";
import { Dashboard } from "pages/Dashboard";
import { Send } from "pages/Send";
import { PrivateRoute } from "components/PrivateRoute";

import { reducer as account } from "ducks/account";
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

        <Switch>
          <Route exact path="/">
            <Landing />
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
