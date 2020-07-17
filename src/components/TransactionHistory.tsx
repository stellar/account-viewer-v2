import React, { useEffect } from "react";
import { fetchTxHistoryAction } from "ducks/txHistory";
import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import styled from "styled-components";

const El = styled.div`
  padding-bottom: 10px;
`;

export const TransactionHistory = () => {
  const { account, txHistory } = useRedux(["account", "txHistory"]);
  const accountId = account.data?.id;
  const dispatch = useDispatch();

  const handleAccountIdChange = () => {
    if (accountId) {
      dispatch(fetchTxHistoryAction(accountId));
    }
  };

  useEffect(handleAccountIdChange, [accountId]);

  return (
    <El>
      <El>Payments History</El>
      <El>
        {txHistory.data?.map((pt: any) => (
          <El key={pt.id}>{pt.id}</El>
        ))}
      </El>
    </El>
  );
};
