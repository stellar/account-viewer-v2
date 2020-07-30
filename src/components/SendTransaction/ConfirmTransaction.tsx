import React from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import { loadPrivateKey } from "helpers/keyManager";
import { stroopsFromLumens } from "helpers/stroopConversion";
import { sendTxAction } from "ducks/sendTransaction";
import { ActionStatus } from "constants/types.d";
import { FormData } from "./SendTransactionFlow";

const El = styled.div``;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

interface ConfirmTransactionProps {
  formData: FormData;
  maxFee: string;
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
}

export const ConfirmTransaction = ({
  formData,
  maxFee,
  onSuccessfulTx,
  onFailedTx,
}: ConfirmTransactionProps) => {
  const { sendTx, keyStore, account, settings } = useRedux([
    "sendTx",
    "keyStore",
    "account",
    "settings",
  ]);
  const dispatch = useDispatch();

  const handleSend = async () => {
    const { privateKey } = await loadPrivateKey(
      keyStore.keyStoreId,
      keyStore.password,
    );
    const result = await dispatch(
      sendTxAction({
        publicKey: account.data?.id,
        secret: privateKey,
        // formData.federationAddress exists only if valid fed address given
        toAccountId: formData.federationAddress || formData.toAccountId,
        amount: formData.amount,
        fee: stroopsFromLumens(maxFee).toNumber(),
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
        <El>{`Submitting Transaction. Follow ${settings.authType} instructions`}</El>
      )}
    </>
  );
};
