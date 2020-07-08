import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import { Auth } from "components/Auth";
import { Dashboard } from "components/Dashboard";
import { Send } from "components/Send";

import { reducer as counter } from "ducks/counter";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
  }
`;

const store = configureStore({
  reducer: combineReducers({
    counter,
  }),
});

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <GlobalStyle />
          <nav>
            <ul>
              <li>
                <Link to="/">Auth</Link>
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
              <Auth />
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
}
