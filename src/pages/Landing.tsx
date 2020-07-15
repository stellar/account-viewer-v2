import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Modal } from "components/Modal";
import { NewKeyPairForm } from "components/NewKeyPairForm";

const TempLinkEl = styled(Link)`
  display: block;
  margin-bottom: 20px;
`;

const TempLinkButtonEl = styled.div`
  margin-bottom: 20px;
  text-decoration: underline;
  cursor: pointer;
`;

export const Landing = () => {
  const [newKeypaidModalVisible, setNewKeypaidModalVisible] = useState(false);

  const openGenerateNewKeyPairModal = () => {
    setNewKeypaidModalVisible(true);
  };

  const closeGenerateNewKeyPairModal = () => {
    setNewKeypaidModalVisible(false);
  };

  return (
    <div>
      <h1>Stellar Account Viewer</h1>

      <h2>Sign in with a wallet</h2>
      <TempLinkEl to="#">Sign in with Ledger</TempLinkEl>
      <TempLinkEl to="#">Sign in with Trezor</TempLinkEl>
      <TempLinkEl to="#">Sign in with Lyra</TempLinkEl>
      <TempLinkEl to="#">Sign in with Albedo</TempLinkEl>

      <h2>Other authentication methods</h2>
      <TempLinkEl to="/auth/secretkey">Sign in using a Secret Key</TempLinkEl>

      <TempLinkButtonEl onClick={openGenerateNewKeyPairModal}>
        Generate key pair for a new account
      </TempLinkButtonEl>

      <Modal
        visible={newKeypaidModalVisible}
        onClose={closeGenerateNewKeyPairModal}
      >
        <NewKeyPairForm onClose={closeGenerateNewKeyPairModal} />
      </Modal>
    </div>
  );
};
