import React from "react";
import styled, { css } from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

export enum TextButtonVariant {
  primary = "primary",
  secondary = "secondary",
}

const TextButtonEl = styled.button<TextButtonProps>`
  font-size: 1rem;
  line-height: 1.75rem;
  padding: 0.6rem 0.2rem 0.36rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.purple};
  background: none;
  border: none;
  cursor: pointer;

  ${(props) =>
    props.variant === TextButtonVariant.secondary &&
    css`
      font-weight: ${FONT_WEIGHT.normal};
      color: ${PALETTE.black};
      text-decoration: underline;
    `};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TextButtonVariant;
  children: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  variant = TextButtonVariant.primary,
  children,
  ...props
}) => (
  <TextButtonEl variant={variant} {...props}>
    {children}
  </TextButtonEl>
);
