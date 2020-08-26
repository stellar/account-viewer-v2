import React from "react";
import styled from "styled-components";
import createStellarIdenticon from "stellar-identicon-js";
import { PALETTE } from "constants/styles";

const AvatarWrapperEl = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  background-color: ${PALETTE.white80};
  border: 1px solid ${PALETTE.white60};
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const Avatar = ({ publicAddress }: { publicAddress: string }) => {
  const identiconCanvas = publicAddress
    ? createStellarIdenticon(publicAddress)
    : null;

  if (!identiconCanvas) {
    return null;
  }

  return (
    <AvatarWrapperEl>
      <img src={identiconCanvas.toDataURL()} alt="Your identicon" />
    </AvatarWrapperEl>
  );
};
