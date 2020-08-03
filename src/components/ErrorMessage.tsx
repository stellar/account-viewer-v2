import React from "react";
import styled from "styled-components";

const TempErrorEl = styled.div`
  color: #c00;
  margin-bottom: 20px;
`;

export const ErrorMessage = ({ message }: { message: string }) => {
  if (!message) {
    return null;
  }

  return <TempErrorEl>{message}</TempErrorEl>;
};
