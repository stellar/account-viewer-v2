import React, { useState } from "react";
import styled from "styled-components";
import { Keypair } from "stellar-sdk";
import CopyToClipboard from "react-copy-to-clipboard";

import { ReactComponent as IconCopy } from "assets/svg/icon-copy.svg";

import { Button, ButtonVariant } from "components/basic/Button";
import { TextButton } from "components/basic/TextButton";
import { Checkbox } from "components/basic/Checkbox";
import { Heading4 } from "components/basic/Heading";
import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";
import { ErrorMessage } from "components/ErrorMessage";
import { ModalContent } from "components/ModalContent";

import { FONT_WEIGHT, PALETTE } from "constants/styles";
import { useErrorMessage } from "hooks/useErrorMessage";
import { ModalPageProps } from "types/types.d";

const KeyPairWrapperEl = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const KeysEl = styled.div`
  margin-right: 1.5rem;
  word-break: break-all;
  flex: 1;
`;

const KeyWrapperEl = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const KeyLabelEl = styled.div`
  margin-bottom: 0.25rem;
`;

const KeyValueEl = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.black};
`;

const CopyButtonEl = styled.div`
  min-width: 130px;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmWrapperEl = styled.div`
  margin-top: 1.5rem;
`;

interface KeyPairType {
  publicKey: string;
  secretKey: string;
}

export const NewKeyPairForm = ({ onClose }: ModalPageProps) => {
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [newKeyPair, setNewKeyPair] = useState<KeyPairType | undefined>();
  const [keyPairCopyString, setKeyPairCopyString] = useState("");
  const [isKeyPairCopied, setIsKeyPairCopied] = useState(false);
  const [confirmSavedSecretKey, setConfirmSavedSecretKey] = useState(false);
  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: "",
  });

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
        "Please confirm that you have copied and saved your secret key",
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

  const handleCopyKeys = () => {
    setIsKeyPairCopied(true);
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
          headlineText="Generate a new key pair"
          buttonFooter={
            <>
              <Button onClick={handleContinue}>Continue</Button>
              <Button onClick={handleClose} variant={ButtonVariant.secondary}>
                Cancel
              </Button>
            </>
          }
        >
          <InfoBlock variant={InfoBlockVariant.warning}>
            <Heading4>
              ATTENTION: Copying and pasting your secret key is not recommended
            </Heading4>

            <ul>
              <li>
                By copying and pasting your secret key you are vulnerable to
                different attacks and scams that can result in your secret key
                being stolen.
              </li>
              <li>Only use this option if you’re aware of the risks...</li>
              <li>
                Ideally use other authentication methods like a hardware wallet
                or a browser
              </li>
              <li>...</li>
            </ul>
          </InfoBlock>
        </ModalContent>
      )}

      {/* Show generate new key pair form */}
      {acceptedWarning && (
        <ModalContent
          headlineText="New key pair"
          buttonFooter={
            <Button onClick={handleDone} disabled={!confirmSavedSecretKey}>
              Close
            </Button>
          }
        >
          <InfoBlock variant={InfoBlockVariant.warning}>
            <Heading4>ATTENTION:</Heading4>

            <ul>
              <li>
                It’s really important to keep track of your secret key, and to
                keep it safe.
              </li>
              <li>
                Anyone who knows your secret key has access to your account.
              </li>
              <li>
                If you lose it, you’ll lose access to your account, and no one
                in the known universe will be able to help you get back in.
              </li>
              <li>
                <strong>
                  So keep it in a safe. Write them down on a piece of paper.
                  Don’t ever keep it unencrypted on your computer or in your
                  email.
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

              <CopyToClipboard text={keyPairCopyString} onCopy={handleCopyKeys}>
                <CopyButtonEl>
                  <TextButton icon={<IconCopy />}>
                    {isKeyPairCopied ? "Copied keys" : "Copy keys"}
                  </TextButton>
                </CopyButtonEl>
              </CopyToClipboard>
            </KeyPairWrapperEl>
          )}

          <ConfirmWrapperEl>
            <Checkbox
              id="confirmSavedSecretKey"
              label="I’ve copied my secret key to a safe place"
              checked={!!confirmSavedSecretKey}
              onChange={toggleConfirmSavedSecretKey}
            />
          </ConfirmWrapperEl>

          <ErrorMessage message={errorMessage} marginTop="1.5rem" />
        </ModalContent>
      )}
    </>
  );
};
