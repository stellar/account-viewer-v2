import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button, Heading1 } from "@stellar/design-system";
import { pageInsetStyle, PALETTE } from "constants/styles";

const WrapperEl = styled.div`
  ${pageInsetStyle};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const MessageEl = styled.span`
  font-size: 1rem;
  line-height: 1.5rem;
  margin-top: 1.5625rem;
  margin-bottom: 3rem;
`;

const Heading1El = styled(Heading1)`
  margin-bottom: 0;
  text-align: center;
`;

const TestEl = styled.div`
  color: ${PALETTE.purple};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

export const NotFound = () => {
  const history = useHistory();

  const handleBack = () => {
    history.push({ pathname: "/", search: history.location.search });
  };

  return (
    <WrapperEl>
      <TestEl>Error 404</TestEl>
      <Heading1El>Sorry, that page couldn’t be found.</Heading1El>
      <MessageEl>Have you tried turning it off and on again?</MessageEl>
      <Button onClick={handleBack}>Back to Account Viewer</Button>
    </WrapperEl>
  );
};
