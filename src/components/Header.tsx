import React from "react";
import styled from "styled-components";
import {
  FONT_WEIGHT,
  HEADER_HEIGHT_REM,
  HEADER_VERTICAL_PADDING_REM,
  MEDIA_QUERIES,
  pageInsetStyle,
  PALETTE,
} from "constants/styles";
import { ReactComponent as StellarLogoFull } from "assets/icons/logo-stellar-lockup.svg";

const WrapperEl = styled.div`
  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    padding: ${HEADER_VERTICAL_PADDING_REM}rem 0;
  }
`;

const InsetEl = styled.div`
  ${pageInsetStyle};
  height: ${HEADER_HEIGHT_REM}rem;
  display: flex;
  justify-content: space-between;
`;

const AVLogoEl = styled.div`
  background-color: ${PALETTE.purple};
  color: ${PALETTE.white};
  text-transform: uppercase;
  font-size: 0.875rem;
  line-height: 1.125rem;
  font-weight: ${FONT_WEIGHT.medium};
  padding: 0.2rem 0.375rem 0.125rem;
  border-radius: 0.125rem;
`;

const ContainerEl = styled.div`
  display: flex;
  align-items: center;
`;

const LogoLinkEl = styled.a`
  display: block;
  overflow: hidden;
  height: 1.5rem;
  width: 1.9rem;
  margin-right: 0.75rem;

  @media (min-width: 600px) {
    width: 6rem;
  }

  svg {
    height: 100%;
    width: 6rem;
  }
`;

export const Header = () => (
  <WrapperEl>
    <InsetEl>
      <ContainerEl>
        <LogoLinkEl href="https://www.stellar.org/">
          <StellarLogoFull />
        </LogoLinkEl>
        <AVLogoEl>Account Viewer</AVLogoEl>
      </ContainerEl>
    </InsetEl>
  </WrapperEl>
);
