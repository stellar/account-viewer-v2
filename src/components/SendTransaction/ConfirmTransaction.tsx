import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  Button,
  InfoBlock,
  TextLink,
  Modal,
  Icon,
  Identicon,
} from "@stellar/design-system";

import { LabelAndValue } from "components/LabelAndValue";

import { AppDispatch } from "config/store";
import { getMemoTypeText } from "helpers/getMemoTypeText";
import { logEvent } from "helpers/tracking";
import { sendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, PaymentFormData } from "types/types";

import { AccountIsUnsafe } from "./WarningMessages/AccountIsUnsafe";

interface ConfirmTransactionProps {
  formData: PaymentFormData;
  maxFee: string;
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  onBack: () => void;
}

export const ConfirmTransaction = ({
  formData,
  maxFee,
  onSuccessfulTx,
  onFailedTx,
  onBack,
}: ConfirmTransactionProps) => {
  const { sendTx, settings } = useRedux("sendTx", "keyStore", "settings");
  const { status, errorString } = sendTx;
  const dispatch: AppDispatch = useDispatch();

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
    logEvent("send: confirmed transaction", {
      amount: formData.amount.toString(),
      "used federation address": !!formData.federationAddress,
      "used memo": !!formData.memoContent,
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

  return (
    <>
      <Modal.Heading>Confirm transaction</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Sending to address">
          <Identicon publicAddress={formData.toAccountId} />
        </LabelAndValue>

        {formData.isAccountUnsafe && <AccountIsUnsafe />}

        <LabelAndValue label="Amount">
          {formData.amount}{" "}
          {new BigNumber(formData.amount).eq(1) ? "lumen" : "lumens"}
        </LabelAndValue>

        {formData.memoContent ? (
          <LabelAndValue label="Memo">
            {formData.memoContent} ({getMemoTypeText(formData.memoType)})
          </LabelAndValue>
        ) : null}

        <LabelAndValue label="Fee">{maxFee} lumens</LabelAndValue>

        {!formData.isAccountFunded && (
          <InfoBlock>
            The destination account doesn’t exist. A create account operation
            will be used to create this account.{" "}
            <TextLink href="https://developers.stellar.org/docs/tutorials/create-account/">
              Learn more about account creation
            </TextLink>
          </InfoBlock>
        )}

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
