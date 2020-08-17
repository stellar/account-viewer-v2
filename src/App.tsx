import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
// import { createGlobalStyle } from "styled-components";

import { store } from "config/store";
import { Dashboard } from "pages/Dashboard";
import { Landing } from "pages/Landing";
import { NotFound } from "pages/NotFound";
import { GlobalStyle } from "components/GlobalStyle";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";

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

          <Route component={NotFound} />
        </Switch>
      </Network>
    </Router>
  </Provider>
);
