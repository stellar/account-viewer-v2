import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useRedux } from "hooks/useRedux";

export const PrivateRoute = ({ children, ...rest }: RouteProps) => {
  const { account } = useRedux(["account"]);
  const { isAuthenticated } = account;

  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? children : <Redirect to="/" />)}
    />
  );
};
