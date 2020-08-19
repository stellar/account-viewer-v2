import React from "react";
import styled from "styled-components";
import { PALETTE } from "constants/styles";
import { ReactComponent as HelpIcon } from "assets/icons/icon-help.svg";

const WrapperEl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonEl = styled.div`
  flex: 1;
  border: 1px solid ${PALETTE.white40};
  border-radius: 0.25rem;
  background-color: ${PALETTE.white};
  padding: 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    height: 1.5rem;
    margin-right: 0.75rem;
  }
`;

const LabelEl = styled.span`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
  padding-top: 0.1875rem;
`;

const InfoButtonEl = styled.div`
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.875rem;

  svg {
    width: 100%;
    height: 100%;
    fill: ${PALETTE.black60};
  }
`;

const InfoEl = styled.div`
  display: none;
`;

interface WalletButtonProps {
  imageSrc: string;
  imageAlt: string;
  infoText: string;
  onClick: () => void;
  children: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  imageSrc,
  imageAlt,
  infoText,
  onClick,
  children,
  ...props
}) => (
  <WrapperEl>
    <ButtonEl onClick={onClick} role="button" {...props}>
      <img src={imageSrc} alt={imageAlt} />
      <LabelEl>{children}</LabelEl>
    </ButtonEl>

    {/* TODO: show info */}
    <InfoButtonEl role="button" onClick={() => console.log("Toggle info")}>
      <HelpIcon />
    </InfoButtonEl>

    <InfoEl>{infoText}</InfoEl>
  </WrapperEl>
);
