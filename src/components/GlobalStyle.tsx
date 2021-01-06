import React from "react";
import { createGlobalStyle } from "styled-components";
import { MODAL_OPEN_CLASS_NAME } from "constants/styles";

const Styles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.bodyBackground};
  }
  body.${MODAL_OPEN_CLASS_NAME} {
    overflow: hidden;
  }
`;

export const GlobalStyle = () => <Styles />;
