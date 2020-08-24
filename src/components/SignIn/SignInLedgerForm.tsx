import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { KeyType } from "@stellar/wallet-sdk";

import { ErrorMessage } from "components/ErrorMessage";
import { defaultStellarBipPath } from "constants/settings";
import { ActionStatus, AuthType } from "types/types.d";
import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import {
  fetchLedgerStellarAddressAction,
  resetLedgerAction,
} from "ducks/wallet/ledger";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";

// Note: need to be on https to test Ledger

const TempCheckboxEl = styled.input`
  margin-bottom: 20px;
`;

const TempInputEl = styled.input`
  margin-bottom: 20px;
  min-width: 300px;
`;

export const SignInLedgerForm = () => {
  const { walletLedger, account } = useRedux(["walletLedger", "account"]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isUsingDefaultAccount, setIsUsingDefaultAccount] = useState(true);
  const [ledgerBipPath, setLedgerBipPath] = useState(defaultStellarBipPath);

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: "",
    onUnmount: () => {
      dispatch(resetLedgerAction());
      dispatch(resetAccountAction());
    },
  });

  useEffect(() => {
    if (
      walletLedger.status === ActionStatus.ERROR ||
      account.status === ActionStatus.ERROR
    ) {
      setErrorMessage("Connection failed");
    }
  }, [walletLedger, account, setErrorMessage]);

  useEffect(() => {
    if (walletLedger.status === ActionStatus.SUCCESS) {
      dispatch(fetchAccountAction(walletLedger.data.publicKey));
    }
  }, [dispatch, walletLedger]);

  useEffect(() => {
    if (account.isAuthenticated) {
      history.push("/dashboard");
      dispatch(updateSettingsAction({ authType: AuthType.LEDGER }));
      dispatch(
        storeKeyAction({
          publicKey: walletLedger.data.publicKey,
          keyType: KeyType.ledger,
          path: ledgerBipPath,
        }),
      );
    }
  }, [dispatch, account, history, walletLedger, ledgerBipPath]);

  const handleLedgerSignIn = () => {
    setErrorMessage("");
    dispatch(fetchLedgerStellarAddressAction(ledgerBipPath));
  };

  return (
    <div>
      <h2>Connect with Ledger</h2>
      <div>
        {(walletLedger.status === ActionStatus.PENDING ||
          walletLedger.status === ActionStatus.SUCCESS) && (
          <div>
            <p>Scanning for Ledger Wallet connection …</p>
            <p>More instructions about connection to the wallet</p>
          </div>
        )}
        {walletLedger.status === ActionStatus.SUCCESS &&
          account.status === ActionStatus.SUCCESS && (
            <div>
              <p>Ledger wallet connected</p>
            </div>
          )}
        <ErrorMessage message={errorMessage} />
      </div>
      <div>
        <TempCheckboxEl
          type="checkbox"
          checked={isUsingDefaultAccount}
          onChange={() => setIsUsingDefaultAccount(!isUsingDefaultAccount)}
        />{" "}
        {isUsingDefaultAccount ? (
          "Use default account"
        ) : (
          <TempInputEl
            value={ledgerBipPath}
            onChange={(e) => setLedgerBipPath(e.target.value)}
          />
        )}
      </div>
      <div>
        <button onClick={handleLedgerSignIn}>Sign in with Ledger</button>
      </div>
    </div>
  );
};
