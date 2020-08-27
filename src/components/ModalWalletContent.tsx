import React from "react";
import styled from "styled-components";
import { Heading2 } from "components/basic/Heading";
import { InfoButtonWithTooltip } from "components/InfoButtonWithTooltip";

const WrapperEl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadlineEl = styled(Heading2)`
  margin-bottom: 0;
`;

const ContentEl = styled.div`
  width: 100%;
`;

const HeaderEl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 1.5rem;
`;

const HeaderImageEl = styled.div`
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;

  img {
    width: 100%;
  }
`;

const ButtonsWrapperEl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 0.75rem;

  button {
    margin-top: 0.75rem;
  }

  button:nth-child(2) {
    margin-left: 0.5rem;
  }
`;

interface ModalWalletContentProps {
  headlineText: string;
  imageSrc: string;
  imageAlt: string;
  infoText: string;
  buttonFooter?: React.ReactNode;
  children: React.ReactNode;
}

export const ModalWalletContent = ({
  headlineText,
  imageSrc,
  imageAlt,
  infoText,
  buttonFooter,
  children,
}: ModalWalletContentProps) => (
  <WrapperEl>
    <HeaderImageEl>
      <img src={imageSrc} alt={imageAlt} />
    </HeaderImageEl>
    <HeaderEl>
      <HeadlineEl>{headlineText}</HeadlineEl>
      <InfoButtonWithTooltip>{infoText}</InfoButtonWithTooltip>
    </HeaderEl>
    <ContentEl>{children}</ContentEl>
    {buttonFooter && <ButtonsWrapperEl>{buttonFooter}</ButtonsWrapperEl>}
  </WrapperEl>
);
