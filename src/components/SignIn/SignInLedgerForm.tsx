import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "styled-components";
import { Button, InfoBlock, Loader, TextLink } from "@stellar/design-system";
import { getCatchError } from "@stellar/frontend-helpers";
import { KeyType } from "@stellar/wallet-sdk";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { BipPathInput } from "components/BipPathInput";
import { ErrorMessage } from "components/ErrorMessage";
import { WalletModalContent } from "components/WalletModalContent";

import { defaultStellarBipPath } from "constants/settings";
import { AppDispatch } from "config/store";
import { fetchAccountAction, resetAccountAction } from "ducks/account";
import { storeKeyAction } from "ducks/keyStore";
import { updateSettingsAction } from "ducks/settings";
import { fetchLedgerStellarAddressAction } from "ducks/wallet/ledger";
import { logEvent } from "helpers/tracking";
import { useErrorMessage } from "hooks/useErrorMessage";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, AuthType, ModalPageProps } from "types/types";

const InlineLoadingEl = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  div:nth-child(1) {
    flex-shrink: 0;
    margin-right: 1rem;
  }
`;

// Note: need to be on https to test Ledger

export const SignInLedgerForm = ({ onClose }: ModalPageProps) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { walletLedger, account } = useRedux("walletLedger", "account");
  const {
    data: ledgerData,
    status: ledgerStatus,
    errorString: ledgerErrorMessage,
  } = walletLedger;
  const {
    status: accountStatus,
    isAuthenticated,
    errorString: accountErrorMessage,
  } = account;

  const [ledgerBipPath, setLedgerBipPath] = useState(defaultStellarBipPath);

  const { errorMessage, setErrorMessage } = useErrorMessage({
    initialMessage: ledgerErrorMessage || accountErrorMessage,
    onUnmount: () => {
      // Reset account store, if there are errors.
      // walletLedger store is reset every time modal is closed.
      dispatch(resetAccountAction());
    },
  });

  useEffect(() => {
    if (
      ledgerStatus === ActionStatus.ERROR ||
      accountStatus === ActionStatus.ERROR
    ) {
      const message =
        clarifyLedgerErrorMessage(ledgerErrorMessage) ||
        accountErrorMessage ||
        "Connection failed";
      setErrorMessage(message);
      logEvent("login: saw connect ledger error", {
        message,
      });
    }
  }, [
    ledgerStatus,
    accountStatus,
    setErrorMessage,
    ledgerErrorMessage,
    accountErrorMessage,
  ]);

  useEffect(() => {
    if (ledgerStatus === ActionStatus.SUCCESS) {
      dispatch(fetchAccountAction(ledgerData!.publicKey));
      logEvent("login: connected with ledger");
    }
  }, [ledgerStatus, ledgerData, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({
        pathname: "/dashboard",
        search: location.search,
      });
      dispatch(updateSettingsAction({ authType: AuthType.LEDGER }));
      dispatch(
        storeKeyAction({
          publicKey: ledgerData!.publicKey,
          keyType: KeyType.ledger,
          path: ledgerBipPath,
        }),
      );
    }
  }, [
    isAuthenticated,
    ledgerData,
    ledgerBipPath,
    dispatch,
    navigate,
    location.search,
  ]);

  const clarifyLedgerErrorMessage = (message?: string) => {
    if (!message) {
      return null;
    }

    if (message.includes("0x6511")) {
      return "Please select Stellar app and try again.";
    }

    if (message.includes("0x6700")) {
      return "The firmware does not support WebUSB, please update the firmware.";
    }

    return message;
  };

  const handleConnect = async () => {
    setErrorMessage("");
    try {
      const transport = await TransportWebUSB.request();
      dispatch(fetchLedgerStellarAddressAction({ ledgerBipPath, transport }));
    } catch (e) {
      const error = getCatchError(e);
      const message =
        error.message === "navigator.usb is undefined"
          ? "Your browser does not support WebUSB"
          : error.toString();

      setErrorMessage(message);
    }
  };

  return (
    <WalletModalContent
      type="ledger"
      buttonFooter={
        <>
          <Button onClick={handleConnect}>Connect with Ledger</Button>
          <Button onClick={onClose} variant={Button.variant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      {!ledgerStatus && (
        <InfoBlock>
          <p>
            Make sure your Ledger Wallet is connected with the Stellar
            application open on it.
          </p>
          <p>
            Ledger Wallet is using WebUSB to communicate with hardware wallets,
            check if your browser supports it{" "}
            <TextLink
              href="https://caniuse.com/webusb"
              target="_blank"
              rel="noreferrer"
            >
              here
            </TextLink>
            .
          </p>
        </InfoBlock>
      )}

      {(ledgerStatus === ActionStatus.PENDING ||
        ledgerStatus === ActionStatus.SUCCESS) && (
        <InfoBlock>
          <InlineLoadingEl>
            <Loader />
            <p>Scanning for Ledger Wallet connection…</p>
          </InlineLoadingEl>
        </InfoBlock>
      )}

      {ledgerStatus === ActionStatus.SUCCESS &&
        accountStatus === ActionStatus.SUCCESS && (
          <InfoBlock>
            <p>Ledger wallet connected</p>
          </InfoBlock>
        )}

      <ErrorMessage
        message={errorMessage}
        textAlign="center"
        marginTop="1rem"
      />

      <BipPathInput
        id="trezor"
        value={ledgerBipPath}
        onValueChange={(val) => setLedgerBipPath(val)}
      />
    </WalletModalContent>
  );
};
