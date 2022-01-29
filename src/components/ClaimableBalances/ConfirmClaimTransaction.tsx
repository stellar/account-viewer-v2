import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  InfoBlock,
  Modal,
  Icon,
} from "@stellar/design-system";
import { LabelAndValue } from "components/LabelAndValue";
import { logEvent } from "helpers/tracking";
import { sendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ClaimBalanceData } from "types/types.d";
import { Asset } from "stellar-sdk";


interface ConfirmClaimTransactionProps {
  formData: ClaimBalanceData;
  balanceId: string;
  balanceAsset: Asset;
  maxFee: string;
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  onBack: () => void;
}

export const ConfirmClaimTransaction = ({
  formData,
  balanceId,
  balanceAsset,
  maxFee,
  onSuccessfulTx,
  onFailedTx,
  onBack,
}: ConfirmClaimTransactionProps) => {
  const { sendTx, settings } = useRedux("sendTx", "keyStore", "settings");
  const { status, errorString } = sendTx;
  const dispatch = useDispatch();

  useEffect(() => {
    logEvent("send: saw confirmation screen");
  }, []);

  useEffect(() => {
    if (status === ActionStatus.SUCCESS) {
      onSuccessfulTx();
      logEvent("send: saw send success message");
    }

    if (status === ActionStatus.ERROR) {
      onFailedTx();
      logEvent("send: saw send error message", {
        message: errorString,
      });
    }
  }, [status, onSuccessfulTx, onFailedTx, errorString]);

  const handleSend = () => {
    dispatch(sendTxAction(formData.tx));
    logEvent("Transaction: Claiming balance Id:", {
      balanceId,
    });
  };

  const getInstructionsMessage = (type: AuthType) => {
    switch (type) {
      case AuthType.ALBEDO:
        return "Review the transaction on the Albedo popup.";
      case AuthType.LEDGER:
        return "Review the transaction on your Ledger wallet device.";
      case AuthType.FREIGHTER:
        return "Review the transaction on the Freighter popup.";
      case AuthType.TREZOR:
        return "Follow the instructions on the Trezor popup.";
      default:
        return "Follow the instructions in the popup.";
    }
  };
  const renderAssetIssuerLabel = () => {
    if (!balanceAsset.isNative()) {
      return (
        <LabelAndValue label="Asset Issuer">
          {balanceAsset.issuer}
        </LabelAndValue>);
    } return null;
  };

  return (
    <>
      <Modal.Heading>Confirm transaction</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Claimable Balance ID">
          {balanceId}
        </LabelAndValue>

        <LabelAndValue label="Asset Code">
          {balanceAsset.code}
        </LabelAndValue>

        {renderAssetIssuerLabel()}

        <LabelAndValue label="Fee">{maxFee} lumens</LabelAndValue>

        {status === ActionStatus.PENDING &&
          settings.authType &&
          settings.authType !== AuthType.PRIVATE_KEY && (
            <InfoBlock>{getInstructionsMessage(settings.authType)}</InfoBlock>
          )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleSend}
          iconLeft={<Icon.Send />}
          isLoading={status === ActionStatus.PENDING}
        >
          Submit transaction
        </Button>
        <Button
          onClick={onBack}
          variant={Button.variant.secondary}
          disabled={status === ActionStatus.PENDING}
        >
          Back
        </Button>
      </Modal.Footer>

      {status === ActionStatus.PENDING && (
        <p className="Paragraph--secondary align--right">
          Submitting transaction
        </p>
      )}
    </>
  );
};