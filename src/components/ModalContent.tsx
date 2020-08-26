import React from "react";
import styled from "styled-components";
import { Heading2 } from "components/basic/Heading";

const WrapperEl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadlineEl = styled(Heading2)`
  margin-bottom: 1.5rem;
`;

const ContentEl = styled.div``;

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

interface ModalContentProps {
  headlineText: string;
  buttonFooter: React.ReactNode;
  children: React.ReactNode;
}

export const ModalContent = ({
  headlineText,
  buttonFooter,
  children,
}: ModalContentProps) => (
  <WrapperEl>
    <HeadlineEl>{headlineText}</HeadlineEl>
    <ContentEl>{children}</ContentEl>
    <ButtonsWrapperEl>{buttonFooter}</ButtonsWrapperEl>
  </WrapperEl>
);
