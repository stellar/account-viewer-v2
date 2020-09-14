import React from "react";
import styled from "styled-components";

const InsetEl = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
`;

export const PageContent = ({ children }: { children?: React.ReactNode }) => (
  <InsetEl>{children}</InsetEl>
);
