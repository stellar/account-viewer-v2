import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Keypair } from "stellar-sdk";

import { fetchAccount } from "ducks/account";

const WarningEl = styled.div`
  background-color: #f3e5e5;
  color: #681e1e;
  padding: 20px;
  margin-bottom: 20px;
`;

const TempLinkEl = styled(Link)`
  display: block;
  margin-bottom: 20px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const TempInputEl = styled.input`
  margin-bottom: 20px;
  min-width: 300px;
`;

export const SigninSecretKey = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [secretKey, setSecretKey] = useState("");

  let failedAttempts = 0;

  const handleSignIn = () => {
    if (!secretKey) {
      alert("Please enter your Secret Key");
      return;
    }

    if (failedAttempts > 8) {
      alert("Please wait a few seconds before attempting to log in again.");
    }

    try {
      let keypair = Keypair.fromSecret(secretKey);
      let publicKey = keypair.publicKey();

      dispatch(fetchAccount(publicKey));
      history.push("/dashboard");
    } catch (e) {
      console.error("SECRET KEY :: error :: ", e);

      // Rate limit with exponential backoff.
      failedAttempts++;
      setTimeout(() => {
        failedAttempts--;
      }, 2 ** failedAttempts * 1000);

      alert("Something went wrong, please try again.");
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
              <li>Only use this option if you're aware of the risks...</li>
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

          <TempLinkEl to="/">Cancel</TempLinkEl>
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
              Always check the domain you're accessing Account Viewer before
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

          <TempButtonEl onClick={handleSignIn}>Sign in</TempButtonEl>
        </div>
      )}
    </div>
  );
};
