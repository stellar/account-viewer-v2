import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Modal } from "components/Modal";

const TempLinkEl = styled(Link)`
  display: block;
  margin-bottom: 20px;
`;

export const Landing = () => {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

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

      <button onClick={() => setModalVisible1(true)}>Show modal 1</button>
      <button onClick={() => setModalVisible2(true)}>Show modal 2</button>

      <Modal visible={modalVisible1} onClose={() => setModalVisible1(false)}>
        <div>
          <h2>Modal 1</h2>
        </div>
      </Modal>

      <Modal visible={modalVisible2} onClose={() => setModalVisible2(false)}>
        <div>
          <h2>Modal 2</h2>
        </div>
      </Modal>
    </div>
  );
};
