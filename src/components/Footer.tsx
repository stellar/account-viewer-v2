import styled from "styled-components";
import { TextLink, TextLinkVariant } from "@stellar/design-system";
import {
  FOOTER_HEIGHT_REM,
  FOOTER_VERTICAL_PADDING_REM,
  MEDIA_QUERIES,
  pageInsetStyle,
} from "constants/styles";

const WrapperEl = styled.div`
  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    padding: ${FOOTER_VERTICAL_PADDING_REM}rem 0;
  }
`;

const InsetEl = styled.div`
  ${pageInsetStyle};
  height: ${FOOTER_HEIGHT_REM}rem;
  display: flex;
  align-items: center;

  a {
    margin-right: 1.5rem;
  }
`;

export const Footer = () => (
  <WrapperEl>
    <InsetEl>
      <TextLink
        href="https://www.stellar.org/terms-of-service"
        rel="noreferrer"
        target="_blank"
        variant={TextLinkVariant.secondary}
      >
        Terms of Service
      </TextLink>

      <TextLink
        href="https://www.stellar.org/privacy-policy"
        rel="noreferrer"
        target="_blank"
        variant={TextLinkVariant.secondary}
      >
        Privacy Policy
      </TextLink>
    </InsetEl>
  </WrapperEl>
);
