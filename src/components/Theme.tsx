import React from "react";
import { ThemeProvider } from "styled-components";
import { THEME } from "constants/styles";
import { useRedux } from "hooks/useRedux";

export const Theme = ({ children }: { children: React.ReactNode }) => {
  const { account } = useRedux(["account"]);
  const { isAuthenticated } = account;

  return (
    <ThemeProvider theme={isAuthenticated ? THEME.dashboard : THEME.landing}>
      {children}
    </ThemeProvider>
  );
};
