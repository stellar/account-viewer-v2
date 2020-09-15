import React from "react";
import styled from "styled-components";
import { PALETTE } from "constants/styles";

const ErrorEl = styled.div`
  color: ${PALETTE.red};
  line-height: 1.5rem;
`;

interface ErrorMessageProps {
  message: string;
  marginTop?: string;
  marginBottom?: string;
  textAlign?: "left" | "center" | "right";
}

export const ErrorMessage = ({
  message,
  marginTop = "0",
  marginBottom = "0",
  textAlign = "left",
}: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <ErrorEl style={{ marginTop, marginBottom, textAlign }}>{message}</ErrorEl>
  );
};
