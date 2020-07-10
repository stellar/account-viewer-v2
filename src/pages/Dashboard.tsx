import React, { useEffect } from "react";
import styled from "styled-components";
import { useRedux } from "../hooks/useRedux";
import { fetchAccountTxHistory } from "../ducks/account";
import { useDispatch } from "react-redux";

const El = styled.div`
  padding-bottom: 10px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const Dashboard = () => {
  const { account } = useRedux(["account"]);

  let nativeBalance = 0;
  if (account.data) {
    nativeBalance = account.data.balances.native.total.toFixed();
  }

  return (
    <El>
      <El>Dashboard</El>
      <El>{account.publicKey}</El>
      <El>Your Balance</El>
      <El>{nativeBalance} lumens</El>
      <TempButtonEl>Send</TempButtonEl>
      <TempButtonEl>Receive</TempButtonEl>
      <El>
        <PaymentsHistory />
      </El>
    </El>
  );
};

const PaymentsHistory = () => {
  const { account } = useRedux(["account"]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (account.data) {
      dispatch(fetchAccountTxHistory(account.data.id));
    }
  }, [account.data, dispatch]);

  return (
    <El>
      <El>Payments History</El>
      <El>
        {account.pastTransactions.map((pt: any) => (
          <El key={pt.id}>{pt.id}</El>
        ))}
      </El>
    </El>
  );
};
