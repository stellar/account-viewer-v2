import React from "react";
import styled from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

const ButtonEl = styled.button`
  font-size: 1rem;
  line-height: 1.75rem;
  padding: 0.6rem 1.5rem 0.36rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.white};
  background-color: ${PALETTE.purple};
  border: none;
  border-radius: 0.125rem;
  box-shadow: 0 0.5rem 1rem -0.5rem rgba(0, 0, 0, 0.48);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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
  children: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ icon, children, ...props }) => (
  <ButtonEl {...props}>
    {icon && <IconWrapperEl>{icon}</IconWrapperEl>}
    {children}
  </ButtonEl>
);
