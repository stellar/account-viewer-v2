import React from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import { loadPrivateKey } from "helpers/keyManager";
import { sendTxAction } from "ducks/sendTransaction";
import { ActionStatus } from "ducks/account";
import { FormData } from "./SendTransactionFlow";

const El = styled.div``;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

interface ConfirmProps {
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  formData: FormData;
  maxFee: string;
}

export const ConfirmTransaction = (props: ConfirmProps) => {
  const { sendTx, keyStore } = useRedux(["sendTx", "keyStore"]);
  const { formData, onSuccessfulTx, onFailedTx, maxFee } = props;
  const dispatch = useDispatch();

  const handleSend = async () => {
    const { privateKey } = await loadPrivateKey(keyStore.id, keyStore.password);
    const result = await dispatch(
      sendTxAction({
        secret: privateKey,
        // formData.federationAddress exists only if valid fed address given
        toAccountId: formData.federationAddress || formData.toAccountId,
        amount: formData.amount,
        // Round to nearest Stroop
        fee: Math.round(Number(maxFee) * 1e7),
        memoType: formData.memoType,
        memoContent: formData.memoContent,
      }),
    );

    if (sendTxAction.fulfilled.match(result as any)) {
      onSuccessfulTx();
    } else {
      onFailedTx();
    }
  };

  return (
    <>
      <h1>Confirm Transaction</h1>
      <El>Sending to address: {formData.toAccountId}</El>
      <El>Amount: {formData.amount.toString()}</El>
      <El>Memo: {formData.memoContent}</El>
      <El>Fee: {maxFee}</El>
      <TempButtonEl onClick={handleSend}>Send</TempButtonEl>
      {sendTx.status === ActionStatus.PENDING && (
        <El>Submitting Transaction</El>
      )}
    </>
  );
};
