import React, { useEffect } from "react";
import styled from "styled-components";
import { isConnected } from "@stellar/lyra-api";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { KeyType } from "@stellar/wallet-sdk";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import {
  fetchLyraStellarAddressAction,
  resetLyraAction,
} from "ducks/wallet/lyra";
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

export const SignInLyraForm = ({ onClose }: ModalPageProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { walletLyra, account } = useRedux(["walletLyra", "account"]);
  const {
    data: lyraData,
    status: lyraStatus,
    errorString: lyraErrorMessage,
  } = walletLyra;
  const {
    status: accountStatus,
    isAuthenticated,
    errorString: accountErrorMessage,
  } = account;

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: lyraErrorMessage || accountErrorMessage,
    onUnmount: () => {
      dispatch(resetLyraAction());
      dispatch(resetAccountAction());
    },
  });

  const fetchLyraLogin = () => {
    setErrorMessage("");

    try {
      dispatch(fetchLyraStellarAddressAction());
    } catch (e) {
      setErrorMessage(`Something went wrong. ${e.toString()}`);
    }
  };

  const initLyra = () => {
    if (!isConnected()) {
      setErrorMessage(
        "Please install or activate Lyra extension, and refresh the page to try again.",
      );
      return;
    }

    fetchLyraLogin();
  };

  useEffect(() => {
    if (lyraStatus === ActionStatus.SUCCESS) {
      if (lyraData) {
        try {
          dispatch(fetchAccountAction(lyraData.publicKey));
          dispatch(
            storeKeyAction({
              publicKey: lyraData.publicKey,
              keyType: KeyType.lyra,
            }),
          );
        } catch (e) {
          setErrorMessage(`Something went wrong. ${e.toString()}`);
        }
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [lyraStatus, dispatch, lyraData, setErrorMessage]);

  useEffect(() => {
    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push("/dashboard");
        dispatch(updateSettingsAction({ authType: AuthType.LYRA }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [accountStatus, dispatch, history, isAuthenticated, setErrorMessage]);

  return (
    <div>
      <h1>Sign in with Lyra</h1>

      {!lyraStatus && (
        <>
          <InfoEl>Some instructions</InfoEl>
          <TempButtonEl onClick={initLyra}>Sign in with Lyra</TempButtonEl>
        </>
      )}

      {lyraStatus === ActionStatus.PENDING && (
        <InfoEl>Please follow the instructions in the Lyra popup.</InfoEl>
      )}

      <ErrorMessage message={errorMessage} />

      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
};
