import React from "react";
import { Modal, TextLink } from "@stellar/design-system";
import { wallets } from "constants/wallets";

import "./styles.scss";

interface WalletModalContentProps {
  type: string;
  buttonFooter?: React.ReactNode;
  children: React.ReactNode;
}

export const WalletModalContent: React.FC<WalletModalContentProps> = ({
  type,
  buttonFooter,
  children,
}) => {
  const walletData = wallets[type];

  if (!walletData) {
    throw new Error(
      "There is no Data for this wallet type. Please make sure the type is correct.",
    );
  }

  const renderInfoLink = () => {
    if (walletData.infoLink && walletData.infoLinkText) {
      return (
        <TextLink
          href={walletData.infoLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {walletData.infoLinkText}
        </TextLink>
      );
    }

    return null;
  };

  return (
    <>
      <div className="WalletModalContent__heading">
        <div className="WalletModalContent__heading__logo">
          {walletData.logoSvg}
        </div>
      </div>
      <Modal.Heading>{walletData.title}</Modal.Heading>

      <Modal.Body>
        <p className="align--center">
          {walletData.infoText} {renderInfoLink()}
        </p>
        {children}
      </Modal.Body>

      {buttonFooter && <Modal.Footer>{buttonFooter}</Modal.Footer>}
    </>
  );
};
