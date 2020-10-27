import React, { useEffect } from "react";
import styled from "styled-components";
import { BalanceInfo } from "components/BalanceInfo";
import { TransactionHistory } from "components/TransactionHistory";
import { logEvent } from "helpers/tracking";

const WrapperEl = styled.div`
  width: 100%;
`;

export const Dashboard = () => {
  useEffect(() => {
    logEvent("page: saw account main screen");
  }, []);

  return (
    <WrapperEl>
      <BalanceInfo />
      <TransactionHistory />
    </WrapperEl>
  );
};
