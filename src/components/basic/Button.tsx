import React from "react";
import styled, { css } from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

export enum ButtonVariant {
  primary = "primary",
  secondary = "secondary",
}

const ButtonEl = styled.button<{ variant: ButtonVariant }>`
  font-size: 1rem;
  line-height: 1.75rem;
  padding: 0.5rem 1.5rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.white};
  background-color: ${PALETTE.purple};
  border: none;
  border-radius: 0.125rem;
  box-shadow: 0 0.5rem 1rem -0.5rem rgba(0, 0, 0, 0.48);
  border: 1px solid ${PALETTE.purple};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${PALETTE.purpleDark};
  }

  ${(props) =>
    props.variant === ButtonVariant.secondary &&
    css`
      color: ${PALETTE.purple};
      background-color: ${PALETTE.white};
      box-shadow: none;

      &:hover {
        background-color: ${PALETTE.white60};
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
  margin-right: 0.5rem;
  position: relative;

  svg {
    fill: ${PALETTE.white};
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  children: string;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  variant = ButtonVariant.primary,
  children,
  ...props
}) => (
  <ButtonEl variant={variant} {...props}>
    {icon && <IconWrapperEl>{icon}</IconWrapperEl>}
    {children}
  </ButtonEl>
);
