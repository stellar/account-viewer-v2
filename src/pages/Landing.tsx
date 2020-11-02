import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { Heading1 } from "components/basic/Heading";
import { TextButton, TextButtonVariant } from "components/basic/TextButton";
import { TextLink } from "components/basic/TextLink";

import { Modal } from "components/Modal";
import { NewKeyPairForm } from "components/NewKeyPairForm";
import { SignInAlbedoForm } from "components/SignIn/SignInAlbedoForm";
import { SignInLedgerForm } from "components/SignIn/SignInLedgerForm";
import { SignInFreighterForm } from "components/SignIn/SignInFreighterForm";
import { SignInSecretKeyForm } from "components/SignIn/SignInSecretKeyForm";
import { SignInTrezorForm } from "components/SignIn/SignInTrezorForm";
import { WalletButton } from "components/WalletButton";

import { wallets } from "constants/wallets";
import { pageInsetStyle } from "constants/styles";
import { resetAlbedoAction } from "ducks/wallet/albedo";
import { resetLedgerAction } from "ducks/wallet/ledger";
import { resetFreighterAction } from "ducks/wallet/freighter";
import { resetTrezorAction } from "ducks/wallet/trezor";
import { logEvent } from "helpers/tracking";
import { ModalType } from "types/types.d";

const WrapperEl = styled.div`
  ${pageInsetStyle};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4rem;
`;

const WalletButtonsWrapperEl = styled.div`
  width: 100%;
  max-width: 590px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 3rem 0;

  & > div {
    margin-bottom: 1.5rem;
    width: 100%;

    @media (min-width: 700px) {
      width: calc(50% - 1.75rem);
    }
  }
`;

const ButtonsWrapperEl = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > button {
    margin-bottom: 0.5rem;
  }
`;

export const Landing = () => {
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  useEffect(() => {
    logEvent("page: saw authentication screen");
  }, []);

  const resetWalletState = (type: ModalType | null) => {
    switch (type) {
      case ModalType.SIGNIN_TREZOR:
        dispatch(resetTrezorAction());
        break;
      case ModalType.SIGNIN_LEDGER:
        dispatch(resetLedgerAction());
        break;
      case ModalType.SIGNIN_FREIGHTER:
        dispatch(resetFreighterAction());
        break;
      case ModalType.SIGNIN_ALBEDO:
        dispatch(resetAlbedoAction());
        break;
      default:
      // Do nothing
    }
  };

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    resetWalletState(activeModal);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case ModalType.SIGNIN_SECRET_KEY:
        return <SignInSecretKeyForm onClose={closeModal} />;
      case ModalType.SIGNIN_TREZOR:
        return <SignInTrezorForm onClose={closeModal} />;
      case ModalType.SIGNIN_LEDGER:
        return <SignInLedgerForm onClose={closeModal} />;
      case ModalType.SIGNIN_FREIGHTER:
        return <SignInFreighterForm onClose={closeModal} />;
      case ModalType.SIGNIN_ALBEDO:
        return <SignInAlbedoForm onClose={closeModal} />;
      case ModalType.NEW_KEY_PAIR:
        return <NewKeyPairForm onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <WrapperEl>
      <Heading1>Connect with a wallet</Heading1>

      <WalletButtonsWrapperEl>
        {Object.keys(wallets).map((walletKey) => {
          const wallet = wallets[walletKey];

          return (
            <WalletButton
              key={walletKey}
              onClick={() => openModal(wallet.modalType)}
              imageSrc={wallet.logoImg}
              imageAlt={wallet.logoImgAltText}
              infoText={
                <>
                  {wallet.infoText}{" "}
                  <TextLink
                    href={wallet.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {wallet.infoLinkText}
                  </TextLink>
                </>
              }
            >
              {wallet.title}
            </WalletButton>
          );
        })}
      </WalletButtonsWrapperEl>

      <ButtonsWrapperEl>
        <TextButton
          onClick={() => openModal(ModalType.SIGNIN_SECRET_KEY)}
          variant={TextButtonVariant.secondary}
        >
          Connect with a secret key
        </TextButton>

        <TextButton
          onClick={() => openModal(ModalType.NEW_KEY_PAIR)}
          variant={TextButtonVariant.secondary}
        >
          Generate key pair for a new account
        </TextButton>
      </ButtonsWrapperEl>

      <Modal visible={activeModal !== null} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </WrapperEl>
  );
};
