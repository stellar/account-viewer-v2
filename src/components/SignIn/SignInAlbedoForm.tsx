import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { KeyType } from "@stellar/wallet-sdk";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import {
  fetchAlbedoStellarAddressAction,
  resetAlbedoAction,
} from "ducks/wallet/albedo";
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

export const SignInAlbedoForm = ({ onClose }: ModalPageProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { walletAlbedo, account } = useRedux(["walletAlbedo", "account"]);
  const {
    data: albedoData,
    status: albedoStatus,
    errorString: albedoErrorMessage,
  } = walletAlbedo;
  const {
    status: accountStatus,
    isAuthenticated,
    errorString: accountErrorMessage,
  } = account;

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: albedoErrorMessage || accountErrorMessage,
    onUnmount: () => {
      dispatch(resetAlbedoAction());
      dispatch(resetAccountAction());
    },
  });

  const fetchAlbedoLogin = () => {
    setErrorMessage("");

    try {
      dispatch(fetchAlbedoStellarAddressAction());
    } catch (e) {
      setErrorMessage(`Something went wrong. ${e.toString()}`);
    }
  };

  useEffect(() => {
    if (albedoStatus === ActionStatus.SUCCESS) {
      if (albedoData) {
        try {
          dispatch(fetchAccountAction(albedoData.publicKey));
          dispatch(
            storeKeyAction({
              publicKey: albedoData.publicKey,
              keyType: KeyType.albedo,
            }),
          );
        } catch (e) {
          setErrorMessage(`Something went wrong. ${e.toString()}`);
        }
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [albedoStatus, dispatch, albedoData, setErrorMessage]);

  useEffect(() => {
    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push("/dashboard");
        dispatch(updateSettingsAction({ authType: AuthType.ALBEDO }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [accountStatus, dispatch, history, isAuthenticated, setErrorMessage]);

  return (
    <div>
      <h1>Sign in with Albedo</h1>

      {!albedoStatus && (
        <>
          <InfoEl>Some instructions</InfoEl>
          <TempButtonEl onClick={fetchAlbedoLogin}>
            Sign in with Albedo
          </TempButtonEl>
        </>
      )}

      {albedoStatus === ActionStatus.PENDING && (
        <InfoEl>Please follow the instructions in the Albedo popup.</InfoEl>
      )}

      <ErrorMessage message={errorMessage} />

      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
};
