import React, { useState } from "react";
import StellarSdk, { MemoType, MemoValue } from "stellar-sdk";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { CreateTransaction } from "./CreateTransaction";
import { ConfirmTransaction } from "./ConfirmTransaction";
import { SuccessfulTransaction } from "./SuccessfulTransaction";
import { FailedTransaction } from "./FailedTransaction";

const El = styled.div``;

// CREATE -> CONFIRM -> SUCCESS || ERROR
enum sendState {
  CREATE,
  CONFIRM,
  SUCCESS,
  ERROR,
}

export interface FormData {
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
