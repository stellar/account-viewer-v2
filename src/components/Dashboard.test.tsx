import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { Provider } from "react-redux";

import { render } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

import { reducer as counter } from "ducks/counter";

const store = configureStore({
  reducer: combineReducers({
    counter,
  }),
});

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Dashboard />
    </Provider>,
  );
  const titleElement = getByText(/Dashboard page/i);
  expect(titleElement).toBeInTheDocument();
});
