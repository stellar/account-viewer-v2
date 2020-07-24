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
enum SendState {
  CREATE,
  CONFIRM,
  SUCCESS,
  ERROR,
}

export interface FormData {
  toAccountId: string;
  federationAddress?: string;
  amount: BigNumber;
  fee: string;
  memoType: MemoType;
  memoContent: MemoValue;
}

const initialFormData: FormData = {
  toAccountId: "",
  federationAddress: undefined,
  amount: new BigNumber(0),
  fee: String(StellarSdk.BASE_FEE / 1e7),
  memoType: StellarSdk.MemoNone,
  memoContent: "",
};

export const SendTransactionFlow = () => {
  const [currentStage, setCurrentStage] = useState(SendState.CREATE);
  const [formData, setFormData] = useState(initialFormData);

  return (
    <>
      <div>
        {currentStage === SendState.CREATE && (
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
        {currentStage === SendState.CONFIRM && (
          <El>
            <ConfirmTransaction
              onSuccessfulTx={() => {
                setCurrentStage(SendState.SUCCESS);
              }}
              onFailedTx={() => {
                setCurrentStage(SendState.ERROR);
              }}
              formData={formData}
            />
          </El>
        )}
      </div>
      <div>
        {currentStage === SendState.SUCCESS && (
          <El>
            <SuccessfulTransaction
              onRestartFlow={() => {
                setFormData(initialFormData);
                setCurrentStage(SendState.CREATE);
              }}
            />
          </El>
        )}
      </div>
      <div>
        {currentStage === SendState.ERROR && (
          <El>
            <FailedTransaction
              onEditTransaction={() => setCurrentStage(SendState.CREATE)}
            />
          </El>
        )}
      </div>
    </>
  );
};
