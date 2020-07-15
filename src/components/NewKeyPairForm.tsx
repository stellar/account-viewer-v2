import React, { useState } from "react";
import styled from "styled-components";
import { Keypair } from "stellar-sdk";
import CopyToClipboard from "react-copy-to-clipboard";

const WarningEl = styled.div`
  background-color: #f3e5e5;
  color: #681e1e;
  padding: 20px;
  margin-bottom: 20px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const KeyPairWrapperEl = styled.div`
  margin-bottom: 20px;
`;

const ConfirmWrapperEl = styled.div`
  margin-bottom: 20px;
`;

const TempErrorEl = styled.div`
  color: #c00;
  margin-bottom: 20px;
`;

interface KeyPairType {
  publicKey: string;
  secretKey: string;
}

interface NewKeyPairFormProps {
  onClose?: () => void;
}

export const NewKeyPairForm = ({ onClose }: NewKeyPairFormProps) => {
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [newKeyPair, setNewKeyPair] = useState<KeyPairType | undefined>();
  const [keyPairCopyString, setKeyPairCopyString] = useState("");
  const [isKeyPairCopied, setIsKeyPairCopied] = useState(false);
  const [confirmSavedSecretKey, setConfirmSavedSecretKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        <div>
          <h2>Generate a new key pair</h2>

          <WarningEl>
            <h3>
              ATTENTION: Copying and pasting your secret key is not recommended
            </h3>

            <ul>
              <li>
                By copying and pasting your secret key you are vulnerable to
                different attacks and scams that can result in your secret key
                being stolen.
              </li>
              <li>Only use this option if you're aware of the risks...</li>
              <li>
                Ideally use other authentication methods like a hardware wallet
                or a browser
              </li>
              <li>...</li>
            </ul>
          </WarningEl>

          <TempButtonEl onClick={handleContinue}>Continue</TempButtonEl>
          <TempButtonEl onClick={handleClose}>Cancel</TempButtonEl>
        </div>
      )}

      {/* Show generate new key pair form */}
      {acceptedWarning && (
        <div>
          <h2>New key pair</h2>

          <WarningEl>
            <h3>ATTENTION:</h3>

            <ul>
              <li>
                It's really important to keep track of your secret key, and to
                keep it safe.
              </li>
              <li>
                Anyone who knows your secret key has access to your account.
              </li>
              <li>
                If you lose it, you'll lose access to your account, and no one
                in the known universe will be able to help you get back in.
              </li>
              <li>
                <strong>
                  So keep it in a safe. Write them down on a piece of paper.
                  Don't ever keep it unencrypted on your computer or in your
                  email.
                </strong>
              </li>
            </ul>
          </WarningEl>

          {newKeyPair && (
            <KeyPairWrapperEl>
              <div>Public Key:</div>
              <div>
                <strong>{newKeyPair.publicKey}</strong>
              </div>

              <div>Secret Key:</div>
              <div>
                <strong>{newKeyPair.secretKey}</strong>
              </div>

              <CopyToClipboard text={keyPairCopyString} onCopy={handleCopyKeys}>
                <TempButtonEl>
                  {isKeyPairCopied ? "Copied keys" : "Copy keys"}
                </TempButtonEl>
              </CopyToClipboard>
            </KeyPairWrapperEl>
          )}

          <ConfirmWrapperEl>
            <input
              type="checkbox"
              id="confirmSavedSecretKey"
              name="confirmSavedSecretKey"
              checked={!!confirmSavedSecretKey}
              onChange={toggleConfirmSavedSecretKey}
            />
            <label htmlFor="confirmSavedSecretKey">
              I've copied my secret key to a safe place
            </label>
          </ConfirmWrapperEl>

          {errorMessage && <TempErrorEl>{errorMessage}</TempErrorEl>}

          <TempButtonEl onClick={handleDone}>Close</TempButtonEl>
        </div>
      )}
    </>
  );
};
