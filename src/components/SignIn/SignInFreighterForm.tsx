import { useEffect, useState } from "react";
import { isConnected } from "@stellar/freighter-api";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, InfoBlock } from "@stellar/design-system";
import { KeyType } from "@stellar/wallet-sdk";

import { WalletModalContent } from "components/WalletModalContent";
import { ErrorMessage } from "components/ErrorMessage";

import { AppDispatch } from "config/store";
import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchFreighterStellarAddressAction } from "ducks/wallet/freighter";
import { logEvent } from "helpers/tracking";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types";

export const SignInFreighterForm = ({ onClose }: ModalPageProps) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  const { walletFreighter, account, settings } = useRedux(
    "walletFreighter",
    "account",
    "settings",
  );
  const {
    data: freighterData,
    status: freighterStatus,
    errorString: freighterErrorMessage,
  } = walletFreighter;
  const {
    status: accountStatus,
    isAuthenticated,
    errorString: accountErrorMessage,
  } = account;

  const [isAvailable, setIsAvailable] = useState(false);
  const { isTestnet } = settings;

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: freighterErrorMessage || accountErrorMessage,
    onUnmount: () => {
      // Reset account store, if there are errors.
      // walletFreighter store is reset every time modal is closed.
      dispatch(resetAccountAction());
    },
  });

  const fetchFreighterLogin = () => {
    setErrorMessage("");
    dispatch(fetchFreighterStellarAddressAction());
  };

  useEffect(() => {
    const checkIfAvailable = async () => {
      try {
        const connected = await isConnected();
        setIsAvailable(connected);
      } catch (e) {
        setIsAvailable(false);
      }
    };

    checkIfAvailable();
  }, []);

  useEffect(() => {
    if (freighterStatus === ActionStatus.SUCCESS) {
      if (freighterData) {
        dispatch(fetchAccountAction(freighterData.publicKey));
        dispatch(
          storeKeyAction({
            publicKey: freighterData.publicKey,
            keyType: KeyType.freighter,
            custom: { network: isTestnet ? "TESTNET" : "PUBLIC" },
          }),
        );
        logEvent("login: connected with freighter");
      } else {
        setErrorMessage("Something went wrong, please try again.");
        logEvent("login: saw connect with freighter error", {
          message: freighterErrorMessage,
        });
      }
    }
  }, [
    freighterStatus,
    dispatch,
    freighterData,
    setErrorMessage,
    freighterErrorMessage,
    isTestnet,
  ]);

  useEffect(() => {
    if (accountStatus === ActionStatus.SUCCESS) {
      if (isAuthenticated) {
        navigate({
          pathname: "/dashboard",
          search: location.search,
        });
        dispatch(updateSettingsAction({ authType: AuthType.FREIGHTER }));
      } else {
        setErrorMessage("Something went wrong, please try again.");
        logEvent("login: saw connect with freighter error", {
          message: accountErrorMessage,
        });
      }
    }
  }, [
    accountStatus,
    dispatch,
    isAuthenticated,
    setErrorMessage,
    accountErrorMessage,
    navigate,
    location.search,
  ]);

  const message = isAvailable
    ? `Click on "Connect with Freighter" to launch Freighter browser extension wallet.`
    : "To use Freighter, please download or enable Freighter browser extension wallet.";

  return (
    <WalletModalContent
      type="freighter"
      buttonFooter={
        <>
          {!freighterStatus && (
            <Button onClick={fetchFreighterLogin} disabled={!isAvailable}>
              Connect with Freighter
            </Button>
          )}
          <Button onClick={onClose} variant={Button.variant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {!freighterStatus && <InfoBlock>{message}</InfoBlock>}

      {freighterStatus === ActionStatus.PENDING && (
        <InfoBlock>
          Please follow the instructions in the Freighter popup.
        </InfoBlock>
      )}

      <ErrorMessage
        message={errorMessage}
        textAlign="center"
        marginTop="1rem"
      />
    </WalletModalContent>
  );
};
