import React, { useState } from "react";
// import { Action } from "@reduxjs/toolkit";
import StellarSdk, { MemoType, MemoValue } from "stellar-sdk";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { sendTxAction } from "ducks/sendTransaction";
import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "ducks/account";
import { loadPrivateKey } from "helpers/keyManager";

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

// CREATE -> CONFIRM -> SUCCESS || ERROR
enum sendState {
  CREATE,
  CONFIRM,
  SUCCESS,
  ERROR,
}

interface FormData {
  toAccountId: string;
  amount: BigNumber;
  fee: string;
  memoType: MemoType;
  memoContent: MemoValue;
}

const initialFormData: FormData = {
  toAccountId: "",
  amount: new BigNumber(0),
  fee: String(StellarSdk.BASE_FEE / 1e7),
  memoType: StellarSdk.MemoNone,
  memoContent: "",
};

export const SendTransactionFlow = () => {
  const [currentStage, setCurrentStage] = useState(sendState.CREATE);
  const [formData, setFormData] = useState(initialFormData);

  return (
    <>
      <div>
        {currentStage === sendState.CREATE && (
          <div>
            <CreateTransaction
              onContinue={() => {
                setCurrentStage(currentStage + 1);
              }}
              onInput={setFormData}
              formData={formData}
            />
          </div>
        )}
      </div>
      <div>
        {currentStage === sendState.CONFIRM && (
          <El>
            <ConfirmTransaction
              onSuccessfulTx={() => {
                setCurrentStage(sendState.SUCCESS);
              }}
              onFailedTx={() => {
                setCurrentStage(sendState.ERROR);
              }}
              formData={formData}
            />
          </El>
        )}
      </div>
      <div>
        {currentStage === sendState.SUCCESS && (
          <El>
            <SuccessfulTransaction
              onRestartFlow={() => {
                setFormData(initialFormData);
                setCurrentStage(sendState.CREATE);
              }}
            />
          </El>
        )}
      </div>
      <div>
        {currentStage === sendState.ERROR && (
          <El>
            <FailedTransaction
              onEditTransaction={() => setCurrentStage(sendState.CREATE)}
            />
          </El>
        )}
      </div>
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

  const [isMemoVisible, setIsMemoVisible] = useState(!!formData.memoContent);

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
          value={formData.toAccountId}
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
          value={formData.amount.toString()}
          placeholder="0"
        ></TempInputEl>
      </El>
      <El>
        {!isMemoVisible && (
          <TempAnchorEl
            onClick={() => {
              onInput({ ...formData, memoType: StellarSdk.MemoText });
              setIsMemoVisible(true);
            }}
          >
            Add memo
          </TempAnchorEl>
        )}
      </El>
      {isMemoVisible && (
        <>
          <El>
            Memo Type:{" "}
            <TempSelectInputEl
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoType: e.target.value as MemoType,
                });
              }}
              value={formData.memoType}
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
              placeholder={
                memoPlaceholderMap[formData.memoType || StellarSdk.MemoNone]
              }
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoContent: e.target.value,
                });
              }}
              value={formData.memoContent as string}
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
                setIsMemoVisible(false);
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

interface ConfirmProps {
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  formData: FormData;
}

const ConfirmTransaction = (props: ConfirmProps) => {
  const { sendTx, keyStore } = useRedux(["sendTx", "keyStore"]);
  const { formData, onSuccessfulTx, onFailedTx } = props;
  const dispatch = useDispatch();

  const handleSend = async () => {
    const { privateKey } = await loadPrivateKey(keyStore.id, keyStore.password);
    const result = await dispatch(
      sendTxAction({
        secret: privateKey,
        toAccountId: formData.toAccountId,
        amount: formData.amount,
        // Round to nearest Stroom
        fee: Math.round(Number(formData.fee) * 1e7),
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
      <El>Fee: {formData.fee}</El>
      <TempButtonEl onClick={handleSend}>Send</TempButtonEl>
      {sendTx.status === ActionStatus.PENDING && (
        <El>Submitting Transaction</El>
      )}
    </>
  );
};

const SuccessfulTransaction = (props: { onRestartFlow: () => void }) => {
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

const FailedTransaction = (props: { onEditTransaction: () => void }) => {
  const { onEditTransaction } = props;
  const { sendTx } = useRedux("sendTx");

  return (
    <El>
      <h1>
        Transaction Failed with Status Code {sendTx.errorData.status || 400}
      </h1>
      <El>See details below for more information.</El>
      {/* eslint-disable camelcase */}
      <El>{sendTx.errorData.extras?.result_xdr}</El>
      <El>{sendTx.errorData.message}</El>
      <El>
        <TempButtonEl onClick={onEditTransaction}>
          Edit Transaction
        </TempButtonEl>
      </El>
    </El>
  );
};
