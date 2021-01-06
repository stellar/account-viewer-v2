import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import {
  Button,
  ButtonVariant,
  InfoBlock,
  Loader,
  TextLink,
} from "@stellar/design-system";

import { ReactComponent as IconSend } from "assets/svg/icon-send.svg";
import { Avatar } from "components/Avatar";
import { ModalContent } from "components/ModalContent";
import { FONT_WEIGHT, PALETTE } from "constants/styles";

import { getMemoTypeText } from "helpers/getMemoTypeText";
import { logEvent } from "helpers/tracking";
import { stroopsFromLumens } from "helpers/stroopConversion";
import { sendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, PaymentFormData } from "types/types.d";

import { AccountFlagged } from "./WarningMessages/AccountFlagged";

const TableEl = styled.table`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  th,
  td {
    display: block;
    text-align: left;
  }

  th {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: ${PALETTE.black60};
    font-weight: ${FONT_WEIGHT.medium};
    text-transform: uppercase;
    padding-bottom: 0.5rem;
  }

  td {
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${PALETTE.black};
    word-break: break-all;
    min-height: 1.5rem;
  }

  tr {
    &:not(:first-child) {
      th {
        padding-top: 1rem;
      }
    }
  }
`;

const AddressWrapperEl = styled.div`
  display: flex;
  align-items: center;

  span {
    padding-left: 0.75rem;
    flex: 1;
  }
`;

const InlineLoadingEl = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  div:nth-child(1) {
    flex-shrink: 0;
  }
`;

const InlineLoadingTextEl = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black60};
  margin-left: 0.5rem;
`;

const WarningMessageEl = styled.div`
  margin: 1.5rem 0 0.5rem;
`;

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
  const { sendTx, account, settings } = useRedux(
    "sendTx",
    "keyStore",
    "account",
    "settings",
  );
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
    dispatch(
      sendTxAction({
        publicKey: account.data?.id,
        // formData.federationAddress exists only if valid fed address given
        toAccountId: formData.federationAddress || formData.toAccountId,
        amount: formData.amount,
        fee: stroopsFromLumens(maxFee).toNumber(),
        memoType: formData.memoType,
        memoContent: formData.memoContent,
        isAccountFunded: formData.isAccountFunded,
      }),
    );
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
    <ModalContent
      headlineText="Confirm transaction"
      buttonFooter={
        <>
          <Button
            onClick={handleSend}
            icon={<IconSend />}
            disabled={status === ActionStatus.PENDING}
          >
            Submit transaction
          </Button>
          <Button
            onClick={onBack}
            variant={ButtonVariant.secondary}
            disabled={status === ActionStatus.PENDING}
          >
            Back
          </Button>
        </>
      }
      footer={
        status === ActionStatus.PENDING && (
          <InlineLoadingEl>
            <Loader />
            <InlineLoadingTextEl>Submitting transaction.</InlineLoadingTextEl>
          </InlineLoadingEl>
        )
      }
    >
      <TableEl>
        <tbody>
          <tr>
            <th>Sending to address</th>
            <td>
              <AddressWrapperEl>
                <Avatar publicAddress={formData.toAccountId} />
                <span>{formData.toAccountId}</span>
              </AddressWrapperEl>
            </td>

            {formData.isAccountUnsafe && (
              <WarningMessageEl>
                <AccountFlagged flagType="unsafe" />
              </WarningMessageEl>
            )}
          </tr>
          <tr>
            <th>Amount</th>
            <td>
              {formData.amount}{" "}
              {new BigNumber(formData.amount).eq(1) ? "lumen" : "lumens"}
            </td>
          </tr>
          {formData.memoContent ? (
            <tr>
              <th>Memo</th>
              <td>
                {formData.memoContent} ({getMemoTypeText(formData.memoType)})
              </td>
            </tr>
          ) : null}
          <tr>
            <th>Fee</th>
            <td>{maxFee} lumens</td>
          </tr>
        </tbody>
      </TableEl>

      {!formData.isAccountFunded && (
        <InfoBlock>
          The destination account doesn’t exist. A create account operation will
          be used to create this account.{" "}
          <TextLink
            href="https://developers.stellar.org/docs/tutorials/create-account/"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about account creation
          </TextLink>
        </InfoBlock>
      )}

      {status === ActionStatus.PENDING &&
        settings.authType &&
        settings.authType !== AuthType.PRIVATE_KEY && (
          <InfoBlock>{getInstructionsMessage(settings.authType)}</InfoBlock>
        )}
    </ModalContent>
  );
};
