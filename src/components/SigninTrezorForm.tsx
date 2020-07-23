import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// TODO: check for future updates @types/trezor-connect doesn't have .stellarGetAddress()
// @ts-ignore
import TrezorConnect from "trezor-connect";

import {
  fetchAccountAction,
  ActionStatus as AccountActionStatus,
} from "ducks/account";
import {
  fetchTrezorStellarAddressAction,
  ActionStatus as TrezorActionStatus,
  actions as trezorActions,
} from "ducks/wallet/trezor";
import { useRedux } from "hooks/useRedux";

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

interface SigninTrezorFormProps {
  onClose?: () => void;
}

export const SigninTrezorForm = ({ onClose }: SigninTrezorFormProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { walletTrezor, account } = useRedux(["walletTrezor", "account"]);
  const {
    data: trezorData,
    status: trezorStatus,
    errorMessage: trezorErrorMessage,
  } = walletTrezor;
  const {
    status: accountStatus,
    isAuthenticated,
    errorMessage: accountErrorMessage,
  } = account;

  const [pageError, setPageError] = useState("");

  const fetchTrezorLogin = () => {
    setPageError("");

    try {
      dispatch(fetchTrezorStellarAddressAction());
    } catch (e) {
      setPageError(`Something went wrong. ${e.toString()}`);
    }
  };

  const initTrezor = () => {
    TrezorConnect.manifest({
      // TODO: Email to use to be contacted by Trezor for maintenance, etc.
      email: "info@stellar.org",
      appUrl: "https://accountviewer.stellar.org/",
    });

    fetchTrezorLogin();
  };

  const handleTrezorStatusChange = () => {
    if (trezorErrorMessage) {
      setPageError(trezorErrorMessage);
      return;
    }

    if (trezorStatus === TrezorActionStatus.SUCCESS) {
      if (trezorData) {
        try {
          dispatch(fetchAccountAction(trezorData));
        } catch (e) {
          setPageError(`Something went wrong. ${e.toString()}`);
        }
      } else {
        setPageError("Something went wrong, please try again.");
      }
    }
  };

  const handleAccountStatusChange = () => {
    if (accountErrorMessage) {
      setPageError(accountErrorMessage);
      return;
    }

    if (accountStatus === AccountActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push("/dashboard");
      } else {
        setPageError("Something went wrong, please try again.");
      }
    }
  };

  const resetOnMount = () => {
    dispatch(trezorActions.reset());
  };

  // TODO: once network config is in place, make sure everything is reset
  // properly (errors cleared, etc)
  useEffect(resetOnMount, []);
  useEffect(handleTrezorStatusChange, [trezorStatus, trezorErrorMessage]);
  useEffect(handleAccountStatusChange, [accountStatus, accountErrorMessage]);

  return (
    <div>
      <h1>Sign in with Trezor</h1>

      {!trezorStatus && (
        <>
          <InfoEl>Some instructions</InfoEl>
          <TempButtonEl onClick={initTrezor}>Sign in with Trezor</TempButtonEl>
        </>
      )}

      {trezorStatus === TrezorActionStatus.PENDING && (
        <InfoEl>Please follow the instructions in the Trezor popup.</InfoEl>
      )}

      {pageError && <TempErrorEl>{pageError}</TempErrorEl>}

      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
};
