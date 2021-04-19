import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import TrezorConnect from "trezor-connect";
import { Button, ButtonVariant, InfoBlock } from "@stellar/design-system";
import { KeyType } from "@stellar/wallet-sdk";

import { ErrorMessage } from "components/ErrorMessage";
import { ModalWalletContent } from "components/ModalWalletContent";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchTrezorStellarAddressAction } from "ducks/wallet/trezor";
import { logEvent } from "helpers/tracking";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types.d";

export const SignInTrezorForm = ({ onClose }: ModalPageProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { walletTrezor, account } = useRedux("walletTrezor", "account");
  const {
    data: trezorData,
    status: trezorStatus,
    errorString: trezorErrorMessage,
  } = walletTrezor;
  const {
    status: accountStatus,
    isAuthenticated,
    errorString: accountErrorMessage,
  } = account;

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: trezorErrorMessage || accountErrorMessage,
    onUnmount: () => {
      // Reset account store, if there are errors.
      // walletTrezor store is reset every time modal is closed.
      dispatch(resetAccountAction());
    },
  });

  const fetchTrezorLogin = () => {
    setErrorMessage("");
    dispatch(fetchTrezorStellarAddressAction());
  };

  const trezorManifest = useMemo(
    () => ({
      email: "accounts+trezor@stellar.org",
      appUrl: "https://accountviewer.stellar.org/",
    }),
    [],
  );

  const initTrezor = () => {
    TrezorConnect.manifest(trezorManifest);
    fetchTrezorLogin();
  };

  useEffect(() => {
    if (trezorStatus === ActionStatus.SUCCESS) {
      if (trezorData) {
        dispatch(fetchAccountAction(trezorData.publicKey));
        dispatch(
          storeKeyAction({
            publicKey: trezorData.publicKey,
            keyType: KeyType.trezor,
            custom: trezorManifest,
          }),
        );
        logEvent("login: connected with trezor");
      } else {
        setErrorMessage("Something went wrong, please try again.");
        logEvent("login: saw connect with trezor error", {
          message: trezorErrorMessage,
        });
      }
    }
  }, [
    trezorStatus,
    dispatch,
    trezorData,
    setErrorMessage,
    trezorErrorMessage,
    trezorManifest,
  ]);

  useEffect(() => {
    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push({
          pathname: "/dashboard",
          search: history.location.search,
        });
        dispatch(updateSettingsAction({ authType: AuthType.TREZOR }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
        logEvent("login: saw connect with trezor error", {
          message: accountErrorMessage,
        });
      }
    }
  }, [
    accountStatus,
    dispatch,
    history,
    isAuthenticated,
    setErrorMessage,
    accountErrorMessage,
  ]);

  return (
    <ModalWalletContent
      type="trezor"
      buttonFooter={
        <>
          {!trezorStatus && (
            <Button onClick={initTrezor}>Connect with Trezor</Button>
          )}
          <Button onClick={onClose} variant={ButtonVariant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {!trezorStatus && (
        <InfoBlock>
          Click on "Connect with Trezor" to be redirected to the external Trezor
          wallet connection setup.
        </InfoBlock>
      )}

      {trezorStatus === ActionStatus.PENDING && (
        <InfoBlock>Follow the instructions on the Trezor popup.</InfoBlock>
      )}

      <ErrorMessage message={errorMessage} textAlign="center" />
    </ModalWalletContent>
  );
};
