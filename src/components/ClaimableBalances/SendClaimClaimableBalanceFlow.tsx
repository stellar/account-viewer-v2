import { useState } from "react";
import { BASE_FEE, Asset } from "stellar-sdk";
import { useDispatch } from "react-redux";

import { ClaimBalanceData } from "types/types.d";
import { resetSendTxAction } from "ducks/sendTx";
import { lumensFromStroops } from "helpers/stroopConversion";
import { CreateClaimableBalance } from "./CreateClaimableBalance";
import { ConfirmClaimTransaction } from "./ConfirmClaimTransaction";
import { SuccessfulClaimTransaction } from "./SuccessfulClaimTransaction";
import { FailedTransaction } from "../SendTransaction/FailedTransaction";

// CREATE -> CONFIRM -> SUCCESS || ERROR
enum SendState {
  CREATE,
  CONFIRM,
  SUCCESS,
  ERROR,
}

interface CBalanceFormData {
  balanceId: string;
  balanceAsset: Asset;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialFormData: ClaimBalanceData = {
  balanceAsset: undefined,
  balanceId: "",
  tx: undefined,
};

export const SendTransactionFlow = ({
  balanceId,
  balanceAsset,
  onCancel,
  onSuccess,
}: CBalanceFormData) => {
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
        <CreateClaimableBalance
          onContinue={(newFormData) => {
            setFormData(newFormData);
            setCurrentStage(currentStage + 1);
          }}
          balanceAsset={balanceAsset}
          balanceId={balanceId}
          onCancel={onCancel}
          setMaxFee={setMaxFee}
          maxFee={maxFee}
        />
      )}

      {currentStage === SendState.CONFIRM && (
        <ConfirmClaimTransaction
          onSuccessfulTx={() => {
            setCurrentStage(SendState.SUCCESS);
          }}
          onFailedTx={() => {
            setCurrentStage(SendState.ERROR);
          }}
          balanceId={balanceId}
          balanceAsset={balanceAsset}
          onBack={handleBack}
          formData={formData}
          maxFee={maxFee}
        />
      )}

      {currentStage === SendState.SUCCESS && (
        <SuccessfulClaimTransaction
          onCancel={onSuccess}
        />
      )}

      {currentStage === SendState.ERROR && (
        <FailedTransaction onEditTransaction={handleBack} onCancel={onCancel} />
      )}
    </>
  );
};
