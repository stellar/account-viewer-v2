import React, { useEffect } from "react";
import { isConnected } from "@stellar/lyra-api";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { KeyType } from "@stellar/wallet-sdk";

// TODO: update Lyra logo once we have it.
import logoLyra from "assets/images/logo-lyra.png";
import { Button, ButtonVariant } from "components/basic/Button";
import { InfoBlock } from "components/basic/InfoBlock";
import { ModalWalletContent } from "components/ModalWalletContent";
import { ErrorMessage } from "components/ErrorMessage";

import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchLyraStellarAddressAction } from "ducks/wallet/lyra";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types.d";

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
      // Reset account store, if there are errors.
      // walletLyra store is reset every time modal is closed.
      dispatch(resetAccountAction());
    },
  });

  const fetchLyraLogin = () => {
    setErrorMessage("");
    dispatch(fetchLyraStellarAddressAction());
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
        dispatch(fetchAccountAction(lyraData.publicKey));
        dispatch(
          storeKeyAction({
            publicKey: lyraData.publicKey,
            keyType: KeyType.lyra,
          }),
        );
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [lyraStatus, dispatch, lyraData, setErrorMessage]);

  useEffect(() => {
    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        history.push({
          pathname: "/dashboard",
          search: history.location.search,
        });
        dispatch(updateSettingsAction({ authType: AuthType.LYRA }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    }
  }, [accountStatus, dispatch, history, isAuthenticated, setErrorMessage]);

  return (
    <ModalWalletContent
      headlineText="Sign in with Lyra"
      imageSrc={logoLyra}
      imageAlt="Lyra logo"
      // TODO: add text
      infoText="TODO"
      buttonFooter={
        <>
          {!lyraStatus && <Button onClick={initLyra}>Sign in with Lyra</Button>}
          <Button onClick={onClose} variant={ButtonVariant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {/* TODO: add instructions */}
      {!lyraStatus && <InfoBlock>Some instructions</InfoBlock>}

      {lyraStatus === ActionStatus.PENDING && (
        <InfoBlock>Please follow the instructions in the Lyra popup.</InfoBlock>
      )}

      <ErrorMessage message={errorMessage} />
    </ModalWalletContent>
  );
};
