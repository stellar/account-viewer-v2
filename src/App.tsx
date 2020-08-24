import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "config/store";
import { GlobalStyle } from "components/GlobalStyle";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { PageContent } from "components/PageContent";
import { Theme } from "components/Theme";

import { Dashboard } from "pages/Dashboard";
import { Landing } from "pages/Landing";
import { NotFound } from "pages/NotFound";

export const App = () => (
  <Provider store={store}>
    <Router>
      <Network>
        <Theme>
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
        </Theme>
      </Network>
    </Router>
  </Provider>
);
