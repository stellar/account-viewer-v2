import { Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout } from "@stellar/design-system";
import { init as SentryInit } from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { reactRouterV5Instrumentation, withProfiler } from "@sentry/react";
import { createBrowserHistory } from "history";

import { store } from "config/store";
import { Network } from "components/Network";
import { PrivateRoute } from "components/PrivateRoute";
import { Header } from "components/Header";

import { Dashboard } from "pages/Dashboard";
import { Landing } from "pages/Landing";
import { NotFound } from "pages/NotFound";

import "styles.scss";

const history = createBrowserHistory();

if (process.env.REACT_APP_SENTRY_KEY) {
  SentryInit({
    dsn: process.env.REACT_APP_SENTRY_KEY,
    release: `account-viewer@${process.env.npm_package_version}`,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: reactRouterV5Instrumentation(history),
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

const AppComponent = () => (
  <Provider store={store}>
    <Router history={history}>
      <Network>
        <Header />

        <Layout.Content>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>

            <PrivateRoute exact path="/dashboard">
              <Dashboard />
            </PrivateRoute>

            <Route component={NotFound} />
          </Switch>
        </Layout.Content>

        <Layout.Footer gitHubLink="https://github.com/stellar/account-viewer-v2" />
      </Network>
    </Router>
  </Provider>
);

export const App = withProfiler(AppComponent);
