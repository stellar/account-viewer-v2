import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// TODO: check for future updates @types/trezor-connect doesn't have .stellarGetAddress()
// @ts-ignore
import TrezorConnect from "trezor-connect";

import {
  fetchAccountAction,
  resetAction as resetAccountAction,
} from "ducks/account";
import { updateAction } from "ducks/settings";
import {
  fetchTrezorStellarAddressAction,
  resetAction as resetTrezorAction,
} from "ducks/wallet/trezor";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType } from "constants/types.d";

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
      email: "accounts+trezor@stellar.org",
      appUrl: "https://accountviewer.stellar.org/",
    });

    fetchTrezorLogin();
  };

  useEffect(
    () => () => {
      if (pageError) {
        dispatch(resetTrezorAction());
        dispatch(resetAccountAction());
      }
    },
    [dispatch, pageError],
  );

  useEffect(() => {
    if (trezorErrorMessage) {
      setPageError(trezorErrorMessage);
      return;
    }

    if (trezorStatus === ActionStatus.SUCCESS) {
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
  }, [trezorStatus, trezorErrorMessage, dispatch, trezorData]);

  useEffect(() => {
    if (accountErrorMessage) {
      setPageError(accountErrorMessage);
      return;
    }

    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push("/dashboard");
        dispatch(updateAction({ authType: AuthType.TREZOR }));
      } else {
        setPageError("Something went wrong, please try again.");
      }
    }
  }, [accountStatus, accountErrorMessage, dispatch, history, isAuthenticated]);

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

      {pageError && <TempErrorEl>{pageError}</TempErrorEl>}

      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
};
