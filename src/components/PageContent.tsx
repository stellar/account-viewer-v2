import React from "react";
import styled from "styled-components";
import {
  FOOTER_HEIGHT_REM,
  FOOTER_VERTICAL_PADDING_REM,
  HEADER_HEIGHT_REM,
  HEADER_VERTICAL_PADDING_REM,
  MEDIA_QUERIES,
} from "constants/styles";
import { useRedux } from "hooks/useRedux";

const headerFooterHeight = HEADER_HEIGHT_REM + FOOTER_HEIGHT_REM;
const paddingHeight =
  (FOOTER_VERTICAL_PADDING_REM + HEADER_VERTICAL_PADDING_REM) * 2;

const InsetEl = styled.div<{ isAuthenticated: boolean }>`
  /* When user is signed in, on smaller screen sizes the Header wraps and is
  twice the height (1.5x in this case). */
  min-height: ${(props) =>
    `calc(100vh - ${headerFooterHeight *
      (props.isAuthenticated ? 1.5 : 1)}rem)`};

  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    min-height: ${`calc(100vh - ${headerFooterHeight + paddingHeight}rem)`};
  }
`;

export const PageContent = ({ children }: { children?: React.ReactNode }) => {
  const { account } = useRedux(["account"]);
  const { isAuthenticated } = account;

  return <InsetEl isAuthenticated={isAuthenticated}>{children}</InsetEl>;
};
