import { css } from "styled-components";
import { Theme } from "types/types.d";

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
  black40 = "#999999",
  grey = "#CCCCCC",
  lightGrey = "#E5E5E5",
  white = "#FFFFFF",
  white80 = "#FAFAFA",
  white60 = "#F2F2F2",
  white40 = "#E5E5E5",
  purple = "#3E1BDB",
  purpleDark = "#3115af",
  charcoal = "#292D3E",
  red = "#CC0000",
  lightRed = "#FFEDEE",
  lightYellow = "#FAECD8",
  green = "#20bf6b",
  orange = "#FA8231",
}

export const THEME: Theme = {
  landing: {
    bodyBackground: PALETTE.white80,
  },
  dashboard: {
    bodyBackground: PALETTE.white,
  },
};

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
  tooltip = 20,
  modal = 30,
}

export enum MEDIA_QUERIES {
  headerFooterHeight = "min-width: 700px",
}

export const MODAL_OPEN_CLASS_NAME = "modal-open";

export const pageInsetStyle = css`
  position: relative;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: ${SCREEN_SIZES.max}px;

  @media (min-width: ${SCREEN_SIZES.mobile}px) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
`;

export const tooltipStyle = css`
  position: absolute;
  top: 2.7rem;
  right: -1rem;
  max-width: 300px;
  border-radius: 0.25rem;
  background-color: ${PALETTE.purple};
  padding: 1rem 1.5rem;
  color: ${PALETTE.white80};
  font-size: 0.875rem;
  line-height: 1.5rem;
  z-index: ${Z_INDEXES.tooltip};
  cursor: default;
`;
