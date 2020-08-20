import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "config/store";
import { Dashboard } from "pages/Dashboard";
import { Landing } from "pages/Landing";
import { NotFound } from "pages/NotFound";
import { GlobalStyle } from "components/GlobalStyle";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { PageContent } from "components/PageContent";

export const App = () => (
  <Provider store={store}>
    <Router>
      <Network>
        <GlobalStyle />
        <Header />

        <PageContent>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>

            <PrivateRoute exact path="/dashboard">
              <Dashboard />
            </PrivateRoute>

            <Route component={NotFound} />
          </Switch>
        </PageContent>

        <Footer />
      </Network>
    </Router>
  </Provider>
);
