import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import { Landing } from "pages/Landing";
import { SigninSecretKey } from "pages/SigninSecretKey";
import { Dashboard } from "pages/Dashboard";
import { Send } from "pages/Send";
import { PrivateRoute } from "components/PrivateRoute";

import { reducer as account } from "ducks/account";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
  }
`;

const store = configureStore({
  reducer: combineReducers({
    account,
  }),
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Account balances in response are Non-Serializable
      ignoredActions: ["account/fetchAccount/fulfilled"],
    },
  }),
});

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
