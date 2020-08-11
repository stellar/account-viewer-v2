import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import TrezorConnect from "trezor-connect";
import { KeyType } from "@stellar/wallet-sdk";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import {
  fetchTrezorStellarAddressAction,
  resetTrezorAction,
} from "ducks/wallet/trezor";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "constants/types.d";
import { ErrorMessage } from "components/ErrorMessage";

const InfoEl = styled.div`
  background-color: #dbdbdb;
  padding: 20px;
  margin-bottom: 20px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const TempLinkButtonEl = styled.div`
  margin-bottom: 20px;
  text-decoration: underline;
  cursor: pointer;
`;

export const SignInTrezorForm = ({ onClose }: ModalPageProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { walletTrezor, account } = useRedux(["walletTrezor", "account"]);
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
      dispatch(resetTrezorAction());
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
        history.push("/dashboard");
        dispatch(updateSettingsAction({ authType: AuthType.TREZOR }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [accountStatus, dispatch, history, isAuthenticated, setErrorMessage]);

  return (
    <div>
      <h1>Sign in with Trezor</h1>

      {!trezorStatus && (
        <>
          <InfoEl>Some instructions</InfoEl>
          <TempButtonEl onClick={initTrezor}>Sign in with Trezor</TempButtonEl>
        </>
      )}

      {trezorStatus === ActionStatus.PENDING && (
        <InfoEl>Please follow the instructions in the Trezor popup.</InfoEl>
      )}

      <ErrorMessage message={errorMessage} />

      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
};
