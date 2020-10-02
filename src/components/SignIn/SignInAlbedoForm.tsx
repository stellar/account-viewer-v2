import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { KeyType } from "@stellar/wallet-sdk";

import { Button, ButtonVariant } from "components/basic/Button";
import { InfoBlock } from "components/basic/InfoBlock";
import { ModalWalletContent } from "components/ModalWalletContent";
import { ErrorMessage } from "components/ErrorMessage";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchAlbedoStellarAddressAction } from "ducks/wallet/albedo";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types.d";

export const SignInAlbedoForm = ({ onClose }: ModalPageProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { walletAlbedo, account } = useRedux("walletAlbedo", "account");
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
      // Reset account store, if there are errors.
      // walletAlbedo store is reset every time modal is closed.
      dispatch(resetAccountAction());
    },
  });

  const fetchAlbedoLogin = () => {
    setErrorMessage("");
    dispatch(fetchAlbedoStellarAddressAction());
  };

  useEffect(() => {
    if (albedoStatus === ActionStatus.SUCCESS) {
      if (albedoData) {
        dispatch(fetchAccountAction(albedoData.publicKey));
        dispatch(
          storeKeyAction({
            publicKey: albedoData.publicKey,
            keyType: KeyType.albedo,
          }),
        );
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [albedoStatus, dispatch, albedoData, setErrorMessage]);

  useEffect(() => {
    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push({
          pathname: "/dashboard",
          search: history.location.search,
        });
        dispatch(updateSettingsAction({ authType: AuthType.ALBEDO }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [accountStatus, dispatch, history, isAuthenticated, setErrorMessage]);

  return (
    <ModalWalletContent
      type="albedo"
      buttonFooter={
        <>
          {!albedoStatus && (
            <Button onClick={fetchAlbedoLogin}>Connect with Albedo</Button>
          )}
          <Button onClick={onClose} variant={ButtonVariant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {/* TODO: add instructions */}
      {!albedoStatus && <InfoBlock>Some instructions</InfoBlock>}

      {albedoStatus === ActionStatus.PENDING && (
        <InfoBlock>
          Please follow the instructions in the Albedo popup.
        </InfoBlock>
      )}

      <ErrorMessage message={errorMessage} textAlign="center" />
    </ModalWalletContent>
  );
};
