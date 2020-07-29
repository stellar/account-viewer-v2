import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Keypair } from "stellar-sdk";

import { fetchAccountAction, reset } from "ducks/account";
import { storePrivateKeyAction } from "ducks/keyStore";
import { update } from "ducks/settings";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType } from "constants/types.d";

const WarningEl = styled.div`
  background-color: #f3e5e5;
  color: #681e1e;
  padding: 20px;
  margin-bottom: 20px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const TempInputEl = styled.input`
  margin-bottom: 20px;
  min-width: 300px;
`;

const TempErrorEl = styled.div`
  color: #c00;
  margin-bottom: 20px;
`;

const TempLinkButtonEl = styled.div`
  margin-bottom: 20px;
  text-decoration: underline;
  cursor: pointer;
`;

interface SigninSecretKeyFormProps {
  onClose?: () => void;
}

export const SigninSecretKeyForm = ({ onClose }: SigninSecretKeyFormProps) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { account } = useRedux(["account"]);
  const { status, isAuthenticated, errorMessage } = account;
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    if (errorMessage) {
      setPageError(errorMessage);
      return;
    }

    if (status === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push("/dashboard");
        dispatch(update({ authType: AuthType.PRIVATE_KEY }));
      } else {
        setPageError("Something went wrong, please try again.");
      }
    }
  }, [status, errorMessage, dispatch, history, isAuthenticated]);

  useEffect(
    () => () => {
      if (errorMessage) {
        dispatch(reset());
      }
    },
    [errorMessage, dispatch],
  );

  let failedAttempts = 0;

  const handleSignIn = async () => {
    if (!secretKey) {
      // TODO:
      // eslint-disable-next-line
      alert("Please enter your Secret Key");
      return;
    }

    if (failedAttempts > 8) {
      // TODO:
      // eslint-disable-next-line
      alert("Please wait a few seconds before attempting to log in again.");
    }

    try {
      const keypair = Keypair.fromSecret(secretKey);
      const publicKey = keypair.publicKey();

      const result = await dispatch(fetchAccountAction(publicKey));
      if (fetchAccountAction.fulfilled.match(result as any)) {
        dispatch(storePrivateKeyAction(secretKey));
      }
    } catch (e) {
      // Rate limit with exponential backoff.
      failedAttempts += 1;
      setTimeout(() => {
        failedAttempts -= 1;
      }, 2 ** failedAttempts * 1000);

      setPageError(`Something went wrong. ${e.toString()}`);
    }
  };

  return (
    <div>
      <h1>Sign in with a Secret Key</h1>

      {/* Show Warning message */}
      {!acceptedWarning && (
        <div>
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
              <li>Only use this option if you’re aware of the risks...</li>
              <li>
                Ideally use other authentication methods like a hardware wallet
                or a browser
              </li>
              <li>...</li>
            </ul>
          </WarningEl>

          <TempButtonEl onClick={() => setAcceptedWarning(true)}>
            I understand the risks of pasting my secret key
          </TempButtonEl>

          <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
        </div>
      )}

      {/* Show Enter Secret Key */}
      {acceptedWarning && (
        <div>
          <WarningEl>
            <p>
              <strong>accountviewer.stellar.org</strong>
            </p>
            <p>
              Always check the domain you’re accessing Account Viewer before
              pasting your keys. Scammers can replicate this page in a different
              domain in order to steal your keys.
            </p>
          </WarningEl>

          <div>
            <h3>Your Secret Key</h3>
            <TempInputEl
              placeholder="Starts with S, example: SCHK...ZLJ&"
              onBlur={(e) => setSecretKey(e.currentTarget.value)}
              type="password"
            />
          </div>

          {pageError && <TempErrorEl>{pageError}</TempErrorEl>}

          <TempButtonEl
            onClick={handleSignIn}
            disabled={status === ActionStatus.PENDING}
          >
            Sign in
          </TempButtonEl>
        </div>
      )}
    </div>
  );
};
