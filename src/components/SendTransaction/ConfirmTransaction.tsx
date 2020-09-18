import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { ReactComponent as IconSend } from "assets/svg/icon-send.svg";
import { Button, ButtonVariant } from "components/basic/Button";
import { InfoBlock } from "components/basic/InfoBlock";
import { Avatar } from "components/Avatar";
import { ModalContent } from "components/ModalContent";
import { FONT_WEIGHT, PALETTE } from "constants/styles";

import { stroopsFromLumens } from "helpers/stroopConversion";
import { sendTxAction } from "ducks/sendTx";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types.d";
import { FormData } from "./SendTransactionFlow";

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

interface ConfirmTransactionProps {
  formData: FormData;
  maxFee: string;
  onSuccessfulTx: () => void;
  onFailedTx: () => void;
  onCancel: () => void;
}

export const ConfirmTransaction = ({
  formData,
  maxFee,
  onSuccessfulTx,
  onFailedTx,
  onCancel,
}: ConfirmTransactionProps) => {
  const { sendTx, account, settings } = useRedux(
    "sendTx",
    "keyStore",
    "account",
    "settings",
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (sendTx.status === ActionStatus.SUCCESS) {
      onSuccessfulTx();
    }

    if (sendTx.status === ActionStatus.ERROR) {
      onFailedTx();
    }
  }, [sendTx.status, onSuccessfulTx, onFailedTx]);

  const handleSend = () =>
    dispatch(
      sendTxAction({
        publicKey: account.data?.id,
        // formData.federationAddress exists only if valid fed address given
        toAccountId: formData.federationAddress || formData.toAccountId,
        amount: formData.amount,
        fee: stroopsFromLumens(maxFee).toNumber(),
        memoType: formData.memoType,
        memoContent: formData.memoContent,
      }),
    );

  return (
    <ModalContent
      headlineText="Confirm transaction"
      buttonFooter={
        <>
          <Button
            onClick={handleSend}
            icon={<IconSend />}
            disabled={sendTx.status === ActionStatus.PENDING}
          >
            Submit transaction
          </Button>
          <Button
            onClick={onCancel}
            variant={ButtonVariant.secondary}
            disabled={sendTx.status === ActionStatus.PENDING}
          >
            Cancel
          </Button>
        </>
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
          </tr>
          <tr>
            <th>Amount</th>
            <td>
              {formData.amount.toString()}{" "}
              {formData.amount.eq(1) ? "lumen" : "lumens"}
            </td>
          </tr>
          <tr>
            <th>Memo</th>
            <td>{formData.memoContent}</td>
          </tr>
          <tr>
            <th>Fee</th>
            <td>{maxFee} lumens</td>
          </tr>
        </tbody>
      </TableEl>

      {sendTx.status === ActionStatus.PENDING && (
        <InfoBlock>{`Submitting transaction. Follow ${settings.authType} instructions.`}</InfoBlock>
      )}
    </ModalContent>
  );
};
