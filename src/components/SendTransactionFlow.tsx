import React, { useState } from "react";
// import { Action } from "@reduxjs/toolkit";
import StellarSdk, { Horizon } from "stellar-sdk";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { sendTxAction } from "ducks/sendTransaction";
import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "ducks/account";
import { loadPrivateKey } from "helpers/keyManager";
// import { AppDispatch } from "App";

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

const initialFormData: FormData = {
  toAccountId: "",
  amount: new BigNumber(0),
  fee: String(StellarSdk.BASE_FEE / 1e7),
  memoType: StellarSdk.MemoNone,
  memoContent: "",
};

export const SendTransactionFlow = () => {
  const [currentStage, setCurrentStage] = useState(sendTxFlowEnum.CREATE);
  const [formData, setFormData] = useState(initialFormData);

  const [
    successTxResponse,
    setSuccessTxResponse,
  ] = useState<Horizon.TransactionResponse | null>(null);

  const [failedTxResponse, setFailedTxResponse] = useState(null);

  return (
    <>
      <div>
        {currentStage === sendTxFlowEnum.CREATE && (
          <div>
            <CreateTransaction
              onContinue={() => {
                setCurrentStage(currentStage + 1);
              }}
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
              onSuccessfulTx={(result) => {
                setSuccessTxResponse(result);
                setCurrentStage(sendTxFlowEnum.SUCCESS);
              }}
              onFailedTx={(result) => {
                setFailedTxResponse(result);
                setCurrentStage(sendTxFlowEnum.ERROR);
              }}
              formData={formData}
            />
          </El>
        )}
      </div>
      <div>
        {currentStage === sendTxFlowEnum.SUCCESS && successTxResponse && (
          <El>
            <SuccessfulTransaction
              txResponse={successTxResponse}
              onRestartFlow={() => {
                setFormData(initialFormData);
                setCurrentStage(sendTxFlowEnum.CREATE);
              }}
            />
          </El>
        )}
      </div>
      <div>
        {currentStage === sendTxFlowEnum.ERROR && failedTxResponse && (
          <El>
            <FailedTransaction
              txResponse={failedTxResponse}
              onEditTransaction={() => setCurrentStage(sendTxFlowEnum.CREATE)}
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
                  memoType: e.target.value,
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
              placeholder={memoPlaceholderMap[formData.memoType]}
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoContent: e.target.value,
                });
              }}
              value={formData.memoContent}
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
  onSuccessfulTx: (result: Horizon.TransactionResponse) => void;
  onFailedTx: (result: any) => void;
  formData: FormData;
}

const ConfirmTransaction = (props: ConfirmProps) => {
  const { sendTx, keyStore } = useRedux(["sendTx", "keyStore"]);
  const { formData, onSuccessfulTx, onFailedTx } = props;
  const dispatch = useDispatch();

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
    const { privateKey } = await loadPrivateKey(keyStore.id, keyStore.password);
    const result = await dispatch(
      sendTxAction({
        secret: privateKey,
        toAccountId: formData.toAccountId,
        amount: formData.amount,
        fee: Math.round(Number(formData.fee) * 1e7),
        memo: createMemo(formData.memoType, formData.memoContent),
      }),
    );

    if (sendTxAction.fulfilled.match(result as any)) {
      onSuccessfulTx((result as any).payload);
    } else {
      onFailedTx((result as any).payload);
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

const SuccessfulTransaction = (props: {
  onRestartFlow: () => void;
  txResponse: Horizon.TransactionResponse;
}) => {
  const { txResponse, onRestartFlow } = props;
  return (
    <El>
      <h1>Success</h1>
      <El>{txResponse && txResponse.result_xdr}</El>
      <El>
        {/* } TODO - network config */}
        <TempAnchorEl
          href={`https://stellar.expert/explorer/testnet/tx/${txResponse.id}`}
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

const FailedTransaction = (props: {
  onEditTransaction: () => void;
  txResponse: any;
}) => {
  const { txResponse, onEditTransaction } = props;
  const errorCode = txResponse.errorData.response?.status || 400;

  return (
    <El>
      <h1>Transaction Failed with Status Code {errorCode}</h1>
      <El>See details below for more information.</El>
      {/* eslint-disable camelcase */}
      <El>{txResponse.errorData.response?.data.extras.result_xdr}</El>
      <El>{txResponse.errorData.message}</El>
      <El>
        <TempButtonEl onClick={onEditTransaction}>
          Edit Transaction
        </TempButtonEl>
      </El>
    </El>
  );
};
