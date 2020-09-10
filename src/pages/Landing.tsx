import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

// TODO: update Lyra logo once we have it.
import logoLyra from "assets/images/logo-lyra.png";
import logoAlbedo from "assets/svg/logo-albedo.svg";
import logoLedger from "assets/svg/logo-ledger.svg";
import logoTrezor from "assets/svg/logo-trezor.svg";

import { Button } from "components/basic/Button";
import { Heading1, Heading5 } from "components/basic/Heading";
import { TextButton, TextButtonVariant } from "components/basic/TextButton";

import { Modal } from "components/Modal";
import { NewKeyPairForm } from "components/NewKeyPairForm";
import { SignInAlbedoForm } from "components/SignIn/SignInAlbedoForm";
import { SignInLedgerForm } from "components/SignIn/SignInLedgerForm";
import { SignInLyraForm } from "components/SignIn/SignInLyraForm";
import { SignInSecretKeyForm } from "components/SignIn/SignInSecretKeyForm";
import { SignInTrezorForm } from "components/SignIn/SignInTrezorForm";
import { WalletButton } from "components/WalletButton";

import { pageInsetStyle } from "constants/styles";
import { resetAlbedoAction } from "ducks/wallet/albedo";
import { resetLedgerAction } from "ducks/wallet/ledger";
import { resetLyraAction } from "ducks/wallet/lyra";
import { resetTrezorAction } from "ducks/wallet/trezor";
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
    margin-bottom: 1rem;
  }
`;

export const Landing = () => {
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const resetWalletState = (type: ModalType | null) => {
    switch (type) {
      case ModalType.SIGNIN_TREZOR:
        dispatch(resetTrezorAction());
        break;
      case ModalType.SIGNIN_LEDGER:
        dispatch(resetLedgerAction());
        break;
      case ModalType.SIGNIN_LYRA:
        dispatch(resetLyraAction());
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
      case ModalType.SIGNIN_LYRA:
        return <SignInLyraForm onClose={closeModal} />;
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
      <Heading1>Sign in with a wallet</Heading1>

      <WalletButtonsWrapperEl>
        <WalletButton
          onClick={() => openModal(ModalType.SIGNIN_LEDGER)}
          imageSrc={logoLedger}
          imageAlt="Ledger logo"
          // TODO: add info text
          infoText="TODO"
        >
          Sign in with Ledger
        </WalletButton>

        <WalletButton
          onClick={() => openModal(ModalType.SIGNIN_TREZOR)}
          imageSrc={logoTrezor}
          imageAlt="Trezor logo"
          // TODO: add info text
          infoText="TODO"
        >
          Sign in with Trezor
        </WalletButton>

        <WalletButton
          onClick={() => openModal(ModalType.SIGNIN_LYRA)}
          imageSrc={logoLyra}
          imageAlt="Lyra logo"
          // TODO: add info text
          infoText="TODO"
        >
          Sign in with Lyra
        </WalletButton>

        <WalletButton
          onClick={() => openModal(ModalType.SIGNIN_ALBEDO)}
          imageSrc={logoAlbedo}
          imageAlt="Albedo logo"
          // TODO: add info text
          infoText="TODO"
        >
          Sign in with Albedo
        </WalletButton>
      </WalletButtonsWrapperEl>

      <Heading5>Other authentication methods</Heading5>

      <ButtonsWrapperEl>
        <Button onClick={() => openModal(ModalType.SIGNIN_SECRET_KEY)}>
          Sign in using a secret key
        </Button>

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
