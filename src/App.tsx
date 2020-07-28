import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import { store } from "config/store";
import { Landing } from "pages/Landing";
import { Dashboard } from "pages/Dashboard";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
  }
`;

export const App = () => (
  <Provider store={store}>
    <Router>
      <Network>
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
      </Network>
    </Router>
  </Provider>
);
