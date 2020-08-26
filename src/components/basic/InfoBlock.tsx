import React from "react";
import styled, { css } from "styled-components";
import { PALETTE } from "constants/styles";

export enum InfoBlockVariant {
  info = "info",
  warning = "warning",
}

const InfoEl = styled.div<{ variant: InfoBlockVariant }>`
  background-color: ${PALETTE.white80};
  border-radius: 0.25rem;
  padding: 1.5rem;
  color: ${PALETTE.black};

  ${(props) =>
    props.variant === InfoBlockVariant.warning &&
    css`
      background-color: ${PALETTE.lightRed};
    `};
`;

export const InfoBlock = ({
  variant = InfoBlockVariant.info,
  children,
}: {
  variant?: InfoBlockVariant;
  children: React.ReactNode;
}) => <InfoEl variant={variant}>{children}</InfoEl>;
