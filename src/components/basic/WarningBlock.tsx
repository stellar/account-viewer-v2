import React from "react";
import styled from "styled-components";
import { PALETTE } from "constants/styles";

const WarningEl = styled.div`
  background-color: ${PALETTE.lightRed};
  border-radius: 0.25rem;
  padding: 1.5rem;
  color: ${PALETTE.black};
`;

export const WarningBlock = ({ children }: { children: React.ReactNode }) => (
  <WarningEl>{children}</WarningEl>
);
