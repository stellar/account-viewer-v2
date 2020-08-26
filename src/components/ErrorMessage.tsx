import React from "react";
import styled from "styled-components";
import { PALETTE } from "constants/styles";

const ErrorEl = styled.div`
  color: ${PALETTE.red};
`;

interface ErrorMessageProps {
  message: string;
  marginTop?: string;
  marginBottom?: string;
}

export const ErrorMessage = ({
  message,
  marginTop = "0",
  marginBottom = "0",
}: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return <ErrorEl style={{ marginTop, marginBottom }}>{message}</ErrorEl>;
};
