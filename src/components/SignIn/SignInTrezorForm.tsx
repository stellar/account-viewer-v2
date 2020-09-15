import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import TrezorConnect from "trezor-connect";
import { KeyType } from "@stellar/wallet-sdk";

import logoTrezor from "assets/svg/logo-trezor.svg";
import { Button, ButtonVariant } from "components/basic/Button";
import { InfoBlock } from "components/basic/InfoBlock";
import { ErrorMessage } from "components/ErrorMessage";
import { ModalWalletContent } from "components/ModalWalletContent";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchTrezorStellarAddressAction } from "ducks/wallet/trezor";
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

  const initTrezor = () => {
    TrezorConnect.manifest({
      email: "accounts+trezor@stellar.org",
      appUrl: "https://accountviewer.stellar.org/",
    });

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
          }),
        );
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [trezorStatus, dispatch, trezorData, setErrorMessage]);

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
      }
    }
  }, [accountStatus, dispatch, history, isAuthenticated, setErrorMessage]);

  return (
    <ModalWalletContent
      headlineText="Sign in with Trezor"
      imageSrc={logoTrezor}
      imageAlt="Trezor logo"
      // TODO: add text
      infoText="TODO"
      buttonFooter={
        <>
          {!trezorStatus && (
            <Button onClick={initTrezor}>Sign in with Trezor</Button>
          )}
          <Button onClick={onClose} variant={ButtonVariant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {!trezorStatus && <InfoBlock>Some instructions</InfoBlock>}

      {trezorStatus === ActionStatus.PENDING && (
        // TODO: add instructions
        <InfoBlock>
          Please follow the instructions in the Trezor popup.
        </InfoBlock>
      )}

      <ErrorMessage message={errorMessage} />
    </ModalWalletContent>
  );
};
