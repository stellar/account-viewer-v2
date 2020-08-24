import { css } from "styled-components";

export const BASE_FONT_SIZE = 16;
export enum SCREEN_SIZES {
  min = 320,
  mobile = 420,
  max = 1296,
}
export const HEADER_HEIGHT_REM = 3;
export const HEADER_VERTICAL_PADDING_REM = 2;
export const FOOTER_HEIGHT_REM = 3;
export const FOOTER_VERTICAL_PADDING_REM = 2;

export enum PALETTE {
  black = "#000000",
  black80 = "#333333",
  black60 = "#666666",
  grey = "#CCCCCC",
  lightGrey = "#E5E5E5",
  white = "#FFFFFF",
  white80 = "#FAFAFA",
  white60 = "#F2F2F2",
  white40 = "#E5E5E5",
  purple = "#3E1BDB",
}

export enum FONT_FAMILY {
  base = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
  monospace = '"IBM Plex Mono", Consolas, Menlo, monospace',
}

export enum FONT_WEIGHT {
  light = 300,
  normal = 400,
  medium = 500,
  bold = 600,
}

export enum Z_INDEXES {
  modal = 20,
  tooltip = 30,
}

export enum MEDIA_QUERIES {
  headerFooterHeight = "min-width: 700px",
}

export const pageInsetStyle = css`
  position: relative;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: ${SCREEN_SIZES.max}px;
  overflow: hidden;

  @media (min-width: ${SCREEN_SIZES.mobile}px) {
    padding: 0 3rem;
  }
`;
