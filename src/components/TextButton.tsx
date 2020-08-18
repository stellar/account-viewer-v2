import React from "react";
import styled from "styled-components";
import { PALETTE, FONT_WEIGHT } from "constants/styles";

const TextButtonEl = styled.button`
  font-size: 1rem;
  line-height: 1.75rem;
  padding: 0.6rem 0.2rem 0.36rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.purple};
  background: none;
  border: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  ...props
}) => <TextButtonEl {...props}>{children}</TextButtonEl>;
