import React from "react";
import styled from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

const ButtonEl = styled.button`
  font-size: 1rem;
  line-height: 1.75rem;
  padding: 0.5rem 1.5rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.white};
  background-color: ${PALETTE.purple};
  border: none;
  border-radius: 0.125rem;
  box-shadow: 0 0.5rem 1rem -0.5rem rgba(0, 0, 0, 0.48);
  cursor: pointer;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <ButtonEl {...props}>{children}</ButtonEl>
);
