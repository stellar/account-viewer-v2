import React from "react";
import styled, { css } from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

export enum TextButtonVariant {
  primary = "primary",
  secondary = "secondary",
}

const TextButtonEl = styled.button<{ variant: TextButtonVariant }>`
  font-size: 1rem;
  line-height: 1.75rem;
  padding: 0.5rem 0.2rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.purple};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.variant === TextButtonVariant.primary &&
    css`
      &:hover {
        opacity: 0.7;
      }
    `};

  ${(props) =>
    props.variant === TextButtonVariant.secondary &&
    css`
      font-weight: ${FONT_WEIGHT.normal};
      color: ${PALETTE.black};
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    `};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const IconWrapperEl = styled.span`
  display: block;
  width: 1rem;
  height: 1rem;
  margin-bottom: 0.3rem;
  margin-right: 0.75rem;
  position: relative;

  svg {
    fill: ${PALETTE.purple};
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: TextButtonVariant;
  children: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  icon,
  variant = TextButtonVariant.primary,
  children,
  ...props
}) => (
  <TextButtonEl variant={variant} {...props}>
    {icon && <IconWrapperEl>{icon}</IconWrapperEl>}
    {children}
  </TextButtonEl>
);
