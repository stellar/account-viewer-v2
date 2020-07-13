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

import { reducer as account } from "ducks/account";

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
  }),
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        // Account balances in response are Non-Serializable
        ignoredActions: ["account/fetchAccount/fulfilled"],
      },
    }),
    loggerMiddleware,
  ],
});

export const App = () => {
  return (
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

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>

            <Route exact path="/auth/secretkey">
              <SigninSecretKey />
            </Route>

            {/* TODO: Dashboard and Send need to be protected routes */}
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>

            <Route exact path="/send">
              <Send />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};
