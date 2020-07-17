import React, { useState } from "react";
import styled from "styled-components";
import { useRedux } from "hooks/useRedux";
import { TransactionHistory } from "components/TransactionHistory";
import { SendTransactionFlow } from "components/SendTransactionFlow";
import { Modal } from "components/Modal";

const El = styled.div`
  padding-bottom: 10px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const Dashboard = () => {
  const { account } = useRedux(["account"]);
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);

  let nativeBalance = 0;
  if (account.data) {
    nativeBalance = account.data.balances.native.total.toString();
  }

  return (
    <El>
      <El>Dashboard</El>
      <El>{account.publicKey}</El>
      <El>Your Balance</El>
      <El>{nativeBalance} lumens</El>
      <TempButtonEl onClick={() => setIsSendTxModalVisible(true)}>
        Send
      </TempButtonEl>
      <TempButtonEl>Receive</TempButtonEl>
      <El>
        <TransactionHistory />
      </El>
      <Modal
        visible={isSendTxModalVisible}
        onClose={() => setIsSendTxModalVisible(false)}
      >
        <div>
          <SendTransactionFlow />
        </div>
      </Modal>
    </El>
  );
};
