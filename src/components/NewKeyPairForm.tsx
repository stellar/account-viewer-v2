import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Keypair } from "stellar-sdk";
import {
  Button,
  ButtonVariant,
  TextButton,
  Heading4,
} from "@stellar/design-system";

import { ReactComponent as IconCopy } from "assets/svg/icon-copy.svg";

import { Checkbox } from "components/basic/Checkbox";
import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";
import { CopyWithTooltip, TooltipPosition } from "components/CopyWithTooltip";
import { ErrorMessage } from "components/ErrorMessage";
import { ModalContent } from "components/ModalContent";

import { FONT_WEIGHT, PALETTE } from "constants/styles";
import { logEvent } from "helpers/tracking";
import { useErrorMessage } from "hooks/useErrorMessage";
import { ModalPageProps } from "types/types.d";

const INLINE_LAYOUT_WIDTH = "500px";

const KeyPairWrapperEl = styled.div`
  margin-top: 1.875rem;
`;

const KeysEl = styled.div`
  word-break: break-all;
  margin-bottom: 2rem;
`;

const KeyWrapperEl = styled.div`
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`;

const KeyLabelEl = styled.div`
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-size: 0.875rem;
  line-height: 1.125rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.black};
`;

const KeyValueEl = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
`;

const CopyButtonEl = styled.div`
  @media (min-width: ${INLINE_LAYOUT_WIDTH}) {
    margin-bottom: -1rem;
  }
`;

const CopyWrapperEl = styled.div`
  display: inline-block;
`;

const ButtonsWrapperEl = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  button {
    margin-top: 1.5rem;
    align-self: flex-end;
  }

  @media (min-width: ${INLINE_LAYOUT_WIDTH}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    button {
      margin-top: 0;
    }
  }
`;

interface KeyPairType {
  publicKey: string;
  secretKey: string;
}

export const NewKeyPairForm = ({ onClose }: ModalPageProps) => {
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [newKeyPair, setNewKeyPair] = useState<KeyPairType | undefined>();
  const [keyPairCopyString, setKeyPairCopyString] = useState("");
  const [confirmSavedSecretKey, setConfirmSavedSecretKey] = useState(false);
  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: "",
  });

  useEffect(() => {
    const logMessage = acceptedWarning
      ? "login: previewed new kepair"
      : "login: saw new kepair warning";
    logEvent(logMessage);
  }, [acceptedWarning]);

  const generateNewKeyPair = () => {
    const keypair = Keypair.random();

    setNewKeyPair({
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    });

    // Spacing here is important for copied string
    setKeyPairCopyString(`Public key:
${keypair.publicKey()}
Secret key:
${keypair.secret()}`);
  };

  const handleContinue = () => {
    setAcceptedWarning(true);
    generateNewKeyPair();
  };

  const handleDone = () => {
    if (!confirmSavedSecretKey) {
      setErrorMessage(
        "Please confirm that you have copied and stored your secret key",
      );
      return;
    }

    handleClose();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    setErrorMessage("");
  };

  const toggleConfirmSavedSecretKey = () => {
    setErrorMessage("");
    setConfirmSavedSecretKey(!confirmSavedSecretKey);
  };

  return (
    <>
      {/* Show warning */}
      {!acceptedWarning && (
        <ModalContent
          headlineText="Generate a new keypair"
          buttonFooter={
            <>
              <Button onClick={handleContinue}>Continue</Button>
              <Button onClick={handleClose} variant={ButtonVariant.secondary}>
                Cancel
              </Button>
            </>
          }
        >
          <InfoBlock variant={InfoBlockVariant.error}>
            <Heading4>ATTENTION: Secret key wallets are not safe:</Heading4>

            <ul>
              <li>
                Pasting your secret key makes you vulnerable to accidents,
                attacks, and scams that can result in loss of funds.
              </li>
              <li>
                It is safer to create an account using methods that do not share
                your secret key with websites, such as hardware wallets or
                browser extensions.
              </li>
            </ul>
          </InfoBlock>
        </ModalContent>
      )}

      {/* Show generate new key pair form */}
      {acceptedWarning && (
        <ModalContent
          headlineText="Generate a new keypair"
          buttonFooter={
            <ButtonsWrapperEl>
              <Checkbox
                id="confirmSavedSecretKey"
                label="I’ve stored my secret key in a safe place"
                checked={!!confirmSavedSecretKey}
                onChange={toggleConfirmSavedSecretKey}
              />

              <Button onClick={handleDone}>Close</Button>
            </ButtonsWrapperEl>
          }
        >
          <InfoBlock variant={InfoBlockVariant.error}>
            <Heading4>ATTENTION:</Heading4>

            <ul>
              <li>
                It is very important to save your secret key and store it
                somewhere safe.
              </li>
              <li>
                If you lose it, you will lose access to your account. No one in
                the known universe will be able to help you get back in.
              </li>
              <li>
                SDF does not store a copy of your keys and cannot help you
                recover lost keys.
              </li>
              <li>
                Anyone who knows your secret key has access to your funds.
              </li>
              <li>
                You have several options: Write your key down on a piece of
                paper. Keep it in a safe. Store it in a password manager. Use a
                hardware wallet. But don't ever keep it unencrypted on your
                computer or in your email.
              </li>
              <li>
                <strong>
                  Note: Connecting by entering a secret key may be deprecated in
                  a future version of the Account Viewer.
                </strong>
              </li>
            </ul>
          </InfoBlock>

          {newKeyPair && (
            <KeyPairWrapperEl>
              <KeysEl>
                <KeyWrapperEl>
                  <KeyLabelEl>Public key</KeyLabelEl>
                  <KeyValueEl>{newKeyPair.publicKey}</KeyValueEl>
                </KeyWrapperEl>

                <KeyWrapperEl>
                  <KeyLabelEl>Secret key</KeyLabelEl>
                  <KeyValueEl>{newKeyPair.secretKey}</KeyValueEl>
                </KeyWrapperEl>
              </KeysEl>

              <CopyWrapperEl>
                <CopyWithTooltip
                  copyText={keyPairCopyString}
                  tooltipPosition={TooltipPosition.right}
                >
                  <CopyButtonEl>
                    <TextButton icon={<IconCopy />}>Copy keys</TextButton>
                  </CopyButtonEl>
                </CopyWithTooltip>
              </CopyWrapperEl>
            </KeyPairWrapperEl>
          )}

          <ErrorMessage message={errorMessage} marginTop="1.5rem" />
        </ModalContent>
      )}
    </>
  );
};
