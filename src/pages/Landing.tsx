import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TempLinkEl = styled(Link)`
  display: block;
  margin-bottom: 20px;
`;

export const Landing = () => {
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
    </div>
  );
};
