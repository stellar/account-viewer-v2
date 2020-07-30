import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// TODO: check for future updates @types/trezor-connect doesn't have .stellarGetAddress()
// @ts-ignore
import TrezorConnect from "trezor-connect";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { updateSettingsAction } from "ducks/settings";
import {
  fetchTrezorStellarAddressAction,
  resetTrezorAction,
} from "ducks/wallet/trezor";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "constants/types.d";

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

const TempErrorEl = styled.div`
  color: #c00;
  margin-bottom: 20px;
`;

export const SigninTrezorForm = ({ onClose }: ModalPageProps) => {
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

  const { errorMessage, setErrorMessage } = useErrorMessage(
    trezorErrorMessage || accountErrorMessage,
    () => {
      dispatch(resetTrezorAction());
      dispatch(resetAccountAction());
    },
  );

  const fetchTrezorLogin = () => {
    setErrorMessage("");

    try {
      dispatch(fetchTrezorStellarAddressAction());
    } catch (e) {
      setErrorMessage(`Something went wrong. ${e.toString()}`);
    }
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
        try {
          dispatch(fetchAccountAction(trezorData));
        } catch (e) {
          setErrorMessage(`Something went wrong. ${e.toString()}`);
        }
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

      {errorMessage && <TempErrorEl>{errorMessage}</TempErrorEl>}

      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
};
