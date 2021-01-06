import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, ButtonVariant, Input, Loader } from "@stellar/design-system";
import { KeyType } from "@stellar/wallet-sdk";

import { Checkbox } from "components/basic/Checkbox";
import { InfoBlock } from "components/basic/InfoBlock";
import { ErrorMessage } from "components/ErrorMessage";
import { ModalWalletContent } from "components/ModalWalletContent";

import { defaultStellarBipPath } from "constants/settings";
import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchLedgerStellarAddressAction } from "ducks/wallet/ledger";
import { logEvent } from "helpers/tracking";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types.d";

const AccountWrapperEl = styled.div`
  margin-top: 1.5rem;

  & > div:nth-child(2) {
    margin-top: 1.5rem;
  }
`;

const InlineLoadingEl = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  div:nth-child(1) {
    flex-shrink: 0;
    margin-right: 1rem;
  }
`;

// Note: need to be on https to test Ledger

export const SignInLedgerForm = ({ onClose }: ModalPageProps) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { walletLedger, account } = useRedux("walletLedger", "account");
  const {
    data: ledgerData,
    status: ledgerStatus,
    errorString: ledgerErrorMessage,
  } = walletLedger;
  const {
    status: accountStatus,
    isAuthenticated,
    errorString: accountErrorMessage,
  } = account;

  const [isUsingDefaultAccount, setIsUsingDefaultAccount] = useState(true);
  const [ledgerBipPath, setLedgerBipPath] = useState(defaultStellarBipPath);

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: ledgerErrorMessage || accountErrorMessage,
    onUnmount: () => {
      // Reset account store, if there are errors.
      // walletLedger store is reset every time modal is closed.
      dispatch(resetAccountAction());
    },
  });

  useEffect(() => {
    if (
      ledgerStatus === ActionStatus.ERROR ||
      accountStatus === ActionStatus.ERROR
    ) {
      const message =
        ledgerErrorMessage || accountErrorMessage || "Connection failed";
      setErrorMessage(message);
      logEvent("login: saw connect ledger error", {
        message,
      });
    }
  }, [
    ledgerStatus,
    accountStatus,
    setErrorMessage,
    ledgerErrorMessage,
    accountErrorMessage,
  ]);

  useEffect(() => {
    if (ledgerStatus === ActionStatus.SUCCESS) {
      dispatch(fetchAccountAction(ledgerData!.publicKey));
      logEvent("login: connected with ledger");
    }
  }, [ledgerStatus, ledgerData, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      history.push({
        pathname: "/dashboard",
        search: history.location.search,
      });
      dispatch(updateSettingsAction({ authType: AuthType.LEDGER }));
      dispatch(
        storeKeyAction({
          publicKey: ledgerData!.publicKey,
          keyType: KeyType.ledger,
          path: ledgerBipPath,
        }),
      );
    }
  }, [isAuthenticated, ledgerData, ledgerBipPath, dispatch, history]);

  const handleLedgerSignIn = () => {
    setErrorMessage("");
    dispatch(fetchLedgerStellarAddressAction(ledgerBipPath));
  };

  return (
    <ModalWalletContent
      type="ledger"
      buttonFooter={
        <>
          <Button onClick={handleLedgerSignIn}>Connect with Ledger</Button>
          <Button onClick={onClose} variant={ButtonVariant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {!ledgerStatus && (
        <InfoBlock>
          Make sure your Ledger Wallet is connected with the Stellar application
          open on it.
        </InfoBlock>
      )}

      {(ledgerStatus === ActionStatus.PENDING ||
        ledgerStatus === ActionStatus.SUCCESS) && (
        <InfoBlock>
          <InlineLoadingEl>
            <Loader />
            <p>Scanning for Ledger Wallet connection…</p>
          </InlineLoadingEl>
        </InfoBlock>
      )}

      {ledgerStatus === ActionStatus.SUCCESS &&
        accountStatus === ActionStatus.SUCCESS && (
          <InfoBlock>
            <p>Ledger wallet connected</p>
          </InfoBlock>
        )}

      <ErrorMessage message={errorMessage} textAlign="center" />

      <AccountWrapperEl>
        <Checkbox
          id="ledger-default-account"
          label="Use default account"
          checked={isUsingDefaultAccount}
          onChange={() => setIsUsingDefaultAccount(!isUsingDefaultAccount)}
        />

        {!isUsingDefaultAccount && (
          <Input
            id="ledger-account"
            label="Enter BIP path"
            value={ledgerBipPath}
            onChange={(e) => setLedgerBipPath(e.target.value)}
          />
        )}
      </AccountWrapperEl>
    </ModalWalletContent>
  );
};
