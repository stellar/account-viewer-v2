import React from "react";
import { createGlobalStyle } from "styled-components";
import { Normalize } from "styled-normalize";

import { FONTS } from "constants/fonts";
import {
  BASE_FONT_SIZE,
  FONT_FAMILY,
  FONT_WEIGHT,
  MODAL_OPEN_CLASS_NAME,
  PALETTE,
  SCREEN_SIZES,
} from "constants/styles";

const Styles = createGlobalStyle`
  body,
  html,
  input,
  textarea,
  button {
    color: ${PALETTE.black}
  }
  body {
    min-height: 100vh;
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => theme.bodyBackground};
    min-width: ${SCREEN_SIZES.min}px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body,
  html,
  input,
  textarea,
  button {
    font-size: ${BASE_FONT_SIZE}px;
    font-weight: ${FONT_WEIGHT.normal};
    font-family: ${FONT_FAMILY.base};
    line-height: 1;
  }
  /* http://tachyons.io/docs/layout/box-sizing/ */
  body * {
    box-sizing: border-box;
  }
  body.${MODAL_OPEN_CLASS_NAME} {
    overflow: hidden;
  }
  ul {
    line-height: 1.5rem;
    padding: 0 0 0 1rem;
    margin: 0;
    list-style-type: none;

    li {
      position: relative;
    }

    li::before {
      content: "-";
      position: absolute;
      left: -1rem;
    }
  }
  strong {
    font-weight: ${FONT_WEIGHT.medium};
  }
`;

const fontStyles = FONTS.map(
  (font) => `
    @font-face {
      font-display: ${font.fontDisplay || "swap"};
      font-family: "${font.fontFamily}";
      ${font.fontStyle && `font-style: ${font.fontStyle};`}
      src: ${font.src
        .map((src) => `url("${src.url}") format("${src.format}")`)
        .join(", ")};
      ${font.fontWeight && `font-weight: ${font.fontWeight};`}
      ${font.unicodeRange && `unicode-range: ${font.unicodeRange};`}
    }
  `,
).join("");

export const GlobalStyle = () => (
  <>
    <Normalize />
    <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
    <Styles />
  </>
);
