import React from "react";
import styled from "styled-components";
import {
  FOOTER_HEIGHT_REM,
  FOOTER_VERTICAL_PADDING_REM,
  HEADER_HEIGHT_REM,
  HEADER_VERTICAL_PADDING_REM,
  MEDIA_QUERIES,
  pageInsetStyle,
} from "constants/styles";

const headerFooterHeightSmall = HEADER_HEIGHT_REM + FOOTER_HEIGHT_REM;
const paddingHeight =
  (FOOTER_VERTICAL_PADDING_REM + HEADER_VERTICAL_PADDING_REM) * 2;

const WrapperEl = styled.div``;

const InsetEl = styled.div`
  ${pageInsetStyle};
  min-height: ${`calc(100vh - ${headerFooterHeightSmall}rem)`};

  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    min-height: ${`calc(100vh - ${headerFooterHeightSmall +
      paddingHeight}rem)`};
  }
`;

export const PageContent = ({ children }: { children?: React.ReactNode }) => (
  <WrapperEl>
    <InsetEl>{children}</InsetEl>
  </WrapperEl>
);
