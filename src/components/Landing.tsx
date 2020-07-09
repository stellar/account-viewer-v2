import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TempLink = styled(Link)`
  display: block;
  margin-bottom: 20px;
`;

export const Landing = () => {
  return (
    <div>
      <h1>Stellar Account Viewer</h1>

      <h2>Sign in with a wallet</h2>
      <TempLink to="#">Sign in with Ledger</TempLink>
      <TempLink to="#">Sign in with Trezor</TempLink>
      <TempLink to="#">Sign in with Lyra</TempLink>
      <TempLink to="#">Sign in with Albedo</TempLink>

      <h2>Other authentication methods</h2>
      <TempLink to="/auth/secretkey">Sign in using a Secret Key</TempLink>
    </div>
  );
};
