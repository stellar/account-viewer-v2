import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Warning = styled.div`
  background-color: #f3e5e5;
  color: #681e1e;
  padding: 20px;
  margin-bottom: 20px;
`;

const TempLink = styled(Link)`
  display: block;
  margin-bottom: 20px;
`;

const TempButton = styled.button`
  margin-bottom: 20px;
`;

const TempInput = styled.input`
  margin-bottom: 20px;
  min-width: 300px;
`;

export const AuthSecretKey = () => {
  // TODO: put back to false
  const [canContinue, setCanContinue] = useState(true);

  const handleSignIn = () => {
    console.log("SIGN IN");
  };

  return (
    <div>
      <h1>Sign in with a Secret Key</h1>

      {/* Show Warning message */}
      {!canContinue && (
        <div>
          <Warning>
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
          </Warning>

          <TempButton onClick={() => setCanContinue(true)}>
            I understand the risks of pasting my secret key
          </TempButton>

          <TempLink to="/">Cancel</TempLink>
        </div>
      )}

      {/* Show Enter Secret Key */}
      {canContinue && (
        <div>
          {/* TODO: Check if domain matches accountviewer.stellar.org, show
          warning if it doesn't */}
          {/* TODO: ??? this could be easily changed in copied repo, should we
          add something on the backend? */}
          <Warning>
            <p>
              <strong>accountviewer.stellar.org</strong>
            </p>
            <p>
              Always check the domain you're accessing Account Viewer before
              pasting your keys. Scammers can replicate this page in a different
              domain in order to steal your keys.
            </p>
          </Warning>

          <div>
            <h3>Your Secret Key</h3>
            <TempInput placeholder="Starts with S, example: SCHK...ZLJ&" />
          </div>

          {/* TODO: ??? disable button if domain doesn't match? */}
          <TempButton onClick={handleSignIn}>Sign in</TempButton>
        </div>
      )}
    </div>
  );
};
