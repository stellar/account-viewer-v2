import React from "react";
import styled, { css } from "styled-components";
import { PALETTE } from "constants/styles";

export enum InfoBlockVariant {
  info = "info",
  error = "error",
  warning = "warning",
}

const InfoEl = styled.div<{ variant: InfoBlockVariant }>`
  background-color: ${PALETTE.white80};
  border-radius: 0.25rem;
  padding: 1.5rem;
  color: ${PALETTE.black};
  width: 100%;

  ${(props) =>
    props.variant === InfoBlockVariant.error &&
    css`
      background-color: ${PALETTE.lightRed};
    `};

  ${(props) =>
    props.variant === InfoBlockVariant.warning &&
    css`
      background-color: ${PALETTE.lightYellow};
    `};
`;

export const InfoBlock = ({
  variant = InfoBlockVariant.info,
  children,
}: {
  variant?: InfoBlockVariant;
  children: React.ReactNode;
}) => <InfoEl variant={variant}>{children}</InfoEl>;
