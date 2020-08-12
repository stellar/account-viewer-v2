import React from "react";
import styled from "styled-components";

import { ErrorMessage } from "components/ErrorMessage";
import { useRedux } from "hooks/useRedux";

const El = styled.div``;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const FailedTransaction = ({
  onEditTransaction,
}: {
  onEditTransaction: () => void;
}) => {
  const { sendTx } = useRedux("sendTx");

  return (
    <El>
      <h1>Transaction Failed</h1>
      <El>See details below for more information.</El>
      <ErrorMessage message={sendTx.errorString} />
      <El>
        <TempButtonEl onClick={onEditTransaction}>
          Edit Transaction
        </TempButtonEl>
      </El>
    </El>
  );
};
