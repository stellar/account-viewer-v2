import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Keypair } from "stellar-sdk";
import { KeyType } from "@stellar/wallet-sdk";

import { ReactComponent as UrlIllustration } from "assets/svg/url-illustration.svg";

import { Button, ButtonVariant } from "components/basic/Button";
import { Heading4 } from "components/basic/Heading";
import { Input } from "components/basic/Input";
import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";
import { ErrorMessage } from "components/ErrorMessage";
import { ModalContent } from "components/ModalContent";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types.d";

const InputWrapperEl = styled.div`
  margin-top: 1.5rem;
`;

const IllustrationWrapperEl = styled.div`
  margin-bottom: 1rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SignInSecretKeyForm = ({ onClose }: ModalPageProps) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { account } = useRedux(["account"]);
  const { status, isAuthenticated, errorString, data } = account;
  const accountId = data?.id;
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: errorString,
    onUnmount: () => {
      dispatch(resetAccountAction());
    },
  });

  useEffect(() => {
    if (status === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push({
          pathname: "/dashboard",
          search: history.location.search,
        });
        dispatch(updateSettingsAction({ authType: AuthType.PRIVATE_KEY }));
        dispatch(
          storeKeyAction({
            publicKey: accountId,
            privateKey: secretKey,
            keyType: KeyType.plaintextKey,
          }),
        );
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [
    status,
    history,
    isAuthenticated,
    setErrorMessage,
    dispatch,
    accountId,
    secretKey,
  ]);

  let failedAttempts = 0;

  const handleSignIn = () => {
    setErrorMessage("");

    if (!secretKey) {
      setErrorMessage("Please enter your secret key");
      return;
    }

    if (failedAttempts > 8) {
      setErrorMessage(
        "Please wait a few seconds before attempting to log in again",
      );
      return;
    }

    try {
      const keypair = Keypair.fromSecret(secretKey);
      const publicKey = keypair.publicKey();

      dispatch(fetchAccountAction(publicKey));
    } catch (e) {
      // Rate limit with exponential backoff.
      failedAttempts += 1;
      setTimeout(() => {
        failedAttempts -= 1;
      }, 2 ** failedAttempts * 1000);

      setErrorMessage(`Something went wrong. ${e.toString()}`);
    }
  };

  return (
    <>
      {/* Show warning message */}
      {!acceptedWarning && (
        <ModalContent
          headlineText="Sign in with a secret key"
          buttonFooter={
            <>
              <Button onClick={() => setAcceptedWarning(true)}>
                I understand the risks of pasting my secret key
              </Button>

              <Button onClick={onClose} variant={ButtonVariant.secondary}>
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

      {/* Show Enter secret key */}
      {acceptedWarning && (
        <ModalContent
          headlineText="Sign in with a secret key"
          buttonFooter={
            <Button
              onClick={handleSignIn}
              disabled={status === ActionStatus.PENDING}
            >
              Sign in
            </Button>
          }
        >
          <InfoBlock>
            <IllustrationWrapperEl>
              <UrlIllustration />
            </IllustrationWrapperEl>
            <p>
              Always check the domain you’re accessing Account Viewer before
              pasting your keys. Scammers can replicate this page in a different
              domain in order to steal your keys.
            </p>
          </InfoBlock>

          <InputWrapperEl>
            <Input
              id="enter-secret-key"
              placeholder="Starts with S, example: SCHK...ZLJ&"
              onChange={() => setErrorMessage("")}
              onBlur={(e) => setSecretKey(e.currentTarget.value)}
              type="password"
              label="Your secret key"
            />
          </InputWrapperEl>

          <ErrorMessage message={errorMessage} marginTop="1rem" />
        </ModalContent>
      )}
    </>
  );
};
