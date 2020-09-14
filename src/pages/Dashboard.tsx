import React from "react";
import styled from "styled-components";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";

const WrapperEl = styled.div`
  width: 100%;
`;

export const Dashboard = () => (
  <WrapperEl>
    <BalanceInfo />
    <TransactionHistory />
  </WrapperEl>
);
