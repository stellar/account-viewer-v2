import React from "react";
// AnyStyledComponent is not named import
// eslint-disable-next-line import/named
import styled, { css, AnyStyledComponent } from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

const baseStyle = css`
  font-weight: ${FONT_WEIGHT.normal};
  color: ${PALETTE.black};
  margin: 0 0 0.5em;
  padding: 0;
`;

// Base font size 16px
// 32 / 40 (font size / line height)
const Heading1El = styled.h1`
  ${baseStyle};
  font-size: 2rem;
  line-height: 2.5rem;
`;

// 24 / 32
const Heading2El = styled.h2`
  ${baseStyle};
  font-size: 1.5rem;
  line-height: 2rem;
`;

// 20 / 30
const Heading3El = styled.h3`
  ${baseStyle};
  font-size: 1.25rem;
  line-height: 1.875rem;
`;

// 16 / 24
const Heading4El = styled.h4`
  ${baseStyle};
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: ${FONT_WEIGHT.medium};
`;

// 16 / 24
const Heading5El = styled.h5`
  ${baseStyle};
  font-size: 1rem;
  line-height: 1.5rem;
`;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string;
}

const getHeadingComponent = (
  Component: AnyStyledComponent,
): React.FC<HeadingProps> => ({ children, ...props }) => (
  <Component {...props}>{children}</Component>
);

export const Heading1 = getHeadingComponent(Heading1El);
export const Heading2 = getHeadingComponent(Heading2El);
export const Heading3 = getHeadingComponent(Heading3El);
export const Heading4 = getHeadingComponent(Heading4El);
export const Heading5 = getHeadingComponent(Heading5El);
