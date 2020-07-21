import React from "react";
import styled from "styled-components";
import { useRedux } from "hooks/useRedux";

const El = styled.div``;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const TempAnchorEl = styled.a`
  display: block;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: underline;
`;

export const SuccessfulTransaction = (props: { onRestartFlow: () => void }) => {
  const { onRestartFlow } = props;
  const { sendTx } = useRedux("sendTx");
  return (
    <El>
      <h1>Success</h1>
      <El>{sendTx.data.result_xdr}</El>
      <El>
        {/* } TODO - network config */}
        <TempAnchorEl
          href={`https://stellar.expert/explorer/testnet/tx/${sendTx.data.id}`}
          target="_blank"
        >
          See details on StellarExpert
        </TempAnchorEl>
      </El>
      <El>
        <TempButtonEl onClick={onRestartFlow}>
          Send another payment
        </TempButtonEl>
      </El>
    </El>
  );
};
