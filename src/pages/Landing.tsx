import React, { useState } from "react";
import styled from "styled-components";

import logoAlbedo from "assets/images/logo-albedo.png";
import logoLedger from "assets/images/logo-ledger.png";
import logoLyra from "assets/images/logo-lyra.png";
import logoTrezor from "assets/images/logo-trezor.png";

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

enum ModalType {
  SIGNIN_SECRET_KEY,
  SIGNIN_TREZOR,
  SIGNIN_LEDGER,
  SIGNIN_LYRA,
  SIGNIN_ALBEDO,
  NEW_KEY_PAIR,
}

export const Landing = () => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderModal = () => {
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
        {renderModal()}
      </Modal>
    </WrapperEl>
  );
};
