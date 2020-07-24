import React, { useState } from "react";
import StellarSdk, { MemoType, MemoValue } from "stellar-sdk";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { lumensFromStroops } from "helpers/stroopConversion";
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
  memoType: MemoType;
  memoContent: MemoValue;
}

const initialFormData: FormData = {
  toAccountId: "",
  federationAddress: undefined,
  amount: new BigNumber(0),
  memoType: StellarSdk.MemoNone,
  memoContent: "",
};

export const SendTransactionFlow = () => {
  const [currentStage, setCurrentStage] = useState(SendState.CREATE);
  const [formData, setFormData] = useState(initialFormData);
  const [maxFee, setMaxFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );

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
              setMaxFee={setMaxFee}
              maxFee={maxFee}
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
              maxFee={maxFee}
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
