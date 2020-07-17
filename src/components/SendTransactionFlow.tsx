import React, { useState } from "react";
// import { FulfilledAction, RejectedAction } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { sendTransaction } from "ducks/send";
import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "ducks/account";

const El = styled.div``;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const TempInputEl = styled.input`
  margin-bottom: 20px;
  min-width: 300px;
`;

const TempSelectInputEl = styled.select`
  margin-bottom: 20px;
  min-width: 300px;
`;

const TempAnchorEl = styled.a`
  display: block;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: underline;
`;

// CREATE -> CONFIRM -> SUBMIT -> SUCCESS -> ERROR
const sendTxFlowEnum = {
  CREATE: 0,
  CONFIRM: 1,
  SUCCESS: 2,
  ERROR: 3,
};

interface FormData {
  toAccountId: string;
  amount: BigNumber;
  fee: string;
  memoType: string;
  memoContent: string;
}

export const SendTransactionFlow = () => {
  const [currentStage, setCurrentStage] = useState(sendTxFlowEnum.CREATE);
  const [formData, setFormData] = useState({
    toAccountId: "",
    amount: new BigNumber(0),
    fee: String(StellarSdk.BASE_FEE / 1e7),
    memoType: StellarSdk.MemoNone,
    memoContent: "",
  });

  const handleNextStage = () => {
    setCurrentStage(currentStage + 1);
  };

  // const handleSuccessfulTx = (result: any) => {
  //   setCurrentStage(sendTxFlowEnum.SUCCESS);
  // };

  const handleFailedTx = (result: any) => {
    console.log(result);
    setCurrentStage(sendTxFlowEnum.ERROR);
  };

  return (
    <>
      <div>
        {currentStage === sendTxFlowEnum.CREATE && (
          <div>
            <CreateTransaction
              onContinue={handleNextStage}
              onInput={setFormData as () => void}
              formData={formData}
            />
          </div>
        )}
      </div>
      <div>
        {currentStage === sendTxFlowEnum.CONFIRM && (
          <El>
            <ConfirmTransaction
              onContinue={handleNextStage}
              onFailedTx={handleFailedTx}
              formData={formData}
            />
          </El>
        )}
      </div>
      <div>{currentStage === sendTxFlowEnum.SUCCESS && <El>Success</El>}</div>
      <div>{currentStage === sendTxFlowEnum.ERROR && <El>Error</El>}</div>
    </>
  );
};

interface ConfirmProps {
  onContinue: () => void;
  onFailedTx: (result: any) => void;
  formData: FormData;
}

const ConfirmTransaction = (props: ConfirmProps) => {
  const { sendTx } = useRedux(["sendTx"]);
  const { formData, onContinue, onFailedTx } = props;
  const dispatch = useDispatch();

  // ALEC TODO - remove hard coding
  const secret = "SAOMIQJ6XOKB7JQTPUGOLEICC2FEJBWLFNJV3DCDPDUL74MFVJWLJNH5";

  const createMemo = (memoType: any, memoContent: any) => {
    switch (memoType) {
      case StellarSdk.MemoText:
        return StellarSdk.Memo.text(memoContent);
      case StellarSdk.MemoID:
        return StellarSdk.Memo.id(memoContent);
      case StellarSdk.MemoHash:
        return StellarSdk.Memo.hash(memoContent);
      case StellarSdk.MemoReturn:
        return StellarSdk.Memo.return(memoContent);
      case StellarSdk.MemoNone:
      default:
        return StellarSdk.Memo.none();
    }
  };

  const handleSend = async () => {
    const result = await dispatch(
      sendTransaction({
        // ALEC TODO - remove hardcoding
        // account.data?.secret,
        secret,
        toAccountId: formData.toAccountId,
        amount: formData.amount,
        fee: Math.round(Number(formData.fee) * 1e7),
        memo: createMemo(formData.memoType, formData.memoContent),
      }),
    );
    console.log(result);
    if (sendTransaction.fulfilled.match(result as any)) {
      onContinue();
    } else {
      onFailedTx(result);
    }
  };

  return (
    <>
      <h1>Confirm Transaction</h1>
      <El>Sending to address: {formData.toAccountId}</El>
      <El>Amount: {formData.amount.toString()}</El>
      <El>Memo: {formData.memoContent}</El>
      <El>Fee: {formData.fee}</El>
      <TempButtonEl onClick={handleSend}>Send</TempButtonEl>
      {sendTx.status === ActionStatus.PENDING && (
        <El>Submitting Transaction</El>
      )}
    </>
  );
};

interface CreateProps {
  onContinue: () => void;
  onInput: (formData: FormData) => void;
  formData: FormData;
}

const CreateTransaction = (props: CreateProps) => {
  const { formData, onInput } = props;

  const [addMemo, setAddMemo] = useState(false);

  const memoPlaceholderMap: { [index: string]: string } = {
    [StellarSdk.MemoText]: "Up to 28 characters",
    [StellarSdk.MemoID]: "Unsigned 64-bit integer",
    [StellarSdk.MemoHash]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoReturn]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoNone]: "",
  };

  return (
    <El>
      <h1>Send Lumens</h1>
      <El>
        Sending To:{" "}
        <TempInputEl
          type="text"
          onChange={(e) =>
            onInput({ ...formData, toAccountId: e.target.value })
          }
          placeholder="Recipient's public key or federation address"
        ></TempInputEl>
      </El>
      <El>
        Amount (lumens) :{" "}
        <TempInputEl
          type="number"
          onChange={(e) => {
            onInput({
              ...formData,
              amount: new BigNumber(e.target.value || 0),
            });
          }}
          placeholder="0"
        ></TempInputEl>
      </El>
      <El>
        {!addMemo && (
          <TempAnchorEl
            onClick={() => {
              onInput({ ...formData, memoType: StellarSdk.MemoText });
              setAddMemo(true);
            }}
          >
            Add memo
          </TempAnchorEl>
        )}
      </El>
      {addMemo && (
        <>
          <El>
            Memo Type:{" "}
            <TempSelectInputEl
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoType: e.target.value,
                });
              }}
            >
              <option value={StellarSdk.MemoText}>MEMO_TEXT</option>
              <option value={StellarSdk.MemoID}>MEMO_ID</option>
              <option value={StellarSdk.MemoHash}>MEMO_HASH</option>
              <option value={StellarSdk.MemoReturn}>MEMO_RETURN</option>
            </TempSelectInputEl>
          </El>
          <El>
            Memo Content:{" "}
            <TempInputEl
              type="text"
              placeholder={memoPlaceholderMap[formData.memoType]}
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoContent: e.target.value,
                });
              }}
            ></TempInputEl>
          </El>
          <El>
            <TempAnchorEl
              onClick={() => {
                onInput({
                  ...formData,
                  memoType: StellarSdk.MemoNone,
                  memoContent: "",
                });
                setAddMemo(false);
              }}
            >
              Remove memo:
            </TempAnchorEl>
          </El>
        </>
      )}
      <El>
        Fee (lumens) :{" "}
        <TempInputEl
          type="number"
          value={formData.fee}
          onChange={(e) => {
            onInput({ ...formData, fee: e.target.value });
          }}
        ></TempInputEl>
      </El>
      <button onClick={props.onContinue}>Continue</button>
    </El>
  );
};
