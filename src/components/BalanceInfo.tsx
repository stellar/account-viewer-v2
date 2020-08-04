import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { SendTransactionFlow } from "components/SendTransaction/SendTransactionFlow";
import { ReceiveTransaction } from "components/ReceiveTransaction";
import { Modal } from "components/Modal";
import { startAccountWatcherAction } from "ducks/account";
import { useRedux } from "hooks/useRedux";

const El = styled.div`
  padding-bottom: 10px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const BalanceInfo = () => {
  const dispatch = useDispatch();
  const { account } = useRedux(["account"]);
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);
  const [isReceiveTxModalVisible, setIsReceiveTxModalVisible] = useState(false);
  const publicAddress = account.data.id;

  useEffect(() => {
    dispatch(startAccountWatcherAction(publicAddress));
  }, [dispatch, publicAddress]);

  let nativeBalance = 0;
  if (account.data) {
    nativeBalance = account.data.balances.native.total.toString();
  }

  const resetModalStates = () => {
    setIsSendTxModalVisible(false);
    setIsReceiveTxModalVisible(false);
  };

  return (
    <>
      <h2>Your Balance</h2>
      <El>{nativeBalance} lumens</El>
      <TempButtonEl onClick={() => setIsSendTxModalVisible(true)}>
        Send
      </TempButtonEl>
      <TempButtonEl onClick={() => setIsReceiveTxModalVisible(true)}>
        Receive
      </TempButtonEl>

      <Modal
        visible={isSendTxModalVisible || isReceiveTxModalVisible}
        onClose={resetModalStates}
      >
        {isSendTxModalVisible && <SendTransactionFlow />}
        {isReceiveTxModalVisible && <ReceiveTransaction />}
      </Modal>
    </>
  );
};
