import { useState } from "react";
import { MemoNone, BASE_FEE } from "stellar-sdk";
import { useDispatch } from "react-redux";

import { PaymentFormData } from "types/types";
import { resetSendTxAction } from "ducks/sendTx";
import { lumensFromStroops } from "helpers/stroopConversion";
import { CreateTransaction } from "./CreateTransaction";
import { ConfirmTransaction } from "./ConfirmTransaction";
import { SuccessfulTransaction } from "./SuccessfulTransaction";
import { FailedTransaction } from "./FailedTransaction";

// CREATE -> CONFIRM -> SUCCESS || ERROR
enum SendState {
  CREATE,
  CONFIRM,
  SUCCESS,
  ERROR,
}

const initialFormData: PaymentFormData = {
  toAccountId: "",
  federationAddress: undefined,
  amount: "",
  memoType: MemoNone,
  memoContent: "",
  isAccountFunded: true,
  isAccountUnsafe: false,
  tx: undefined,
};

export const SendTransactionFlow = ({ onCancel }: { onCancel: () => void }) => {
  const dispatch = useDispatch();

  const [currentStage, setCurrentStage] = useState(SendState.CREATE);
  const [formData, setFormData] = useState(initialFormData);
  const [maxFee, setMaxFee] = useState(lumensFromStroops(BASE_FEE).toString());

  const handleBack = () => {
    setCurrentStage(SendState.CREATE);
    dispatch(resetSendTxAction());
  };

  return (
    <>
      {currentStage === SendState.CREATE && (
        <CreateTransaction
          onContinue={(newFormData) => {
            setFormData(newFormData);
            setCurrentStage(currentStage + 1);
          }}
          onCancel={onCancel}
          initialFormData={formData}
          setMaxFee={setMaxFee}
          maxFee={maxFee}
        />
      )}

      {currentStage === SendState.CONFIRM && (
        <ConfirmTransaction
          onSuccessfulTx={() => {
            setCurrentStage(SendState.SUCCESS);
          }}
          onFailedTx={() => {
            setCurrentStage(SendState.ERROR);
          }}
          onBack={handleBack}
          formData={formData}
          maxFee={maxFee}
        />
      )}

      {currentStage === SendState.SUCCESS && (
        <SuccessfulTransaction
          onRestartFlow={() => {
            setFormData(initialFormData);
            setCurrentStage(SendState.CREATE);
            dispatch(resetSendTxAction());
          }}
          onCancel={onCancel}
        />
      )}

      {currentStage === SendState.ERROR && (
        <FailedTransaction onEditTransaction={handleBack} onCancel={onCancel} />
      )}
    </>
  );
};
