import React, { useState } from "react";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import { useRedux } from "hooks/useRedux";
import QRCode from "qrcode.react";

const El = styled.div`
  text-align: center;
  padding-bottom: 20px;
`;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

export const ReceiveTransaction = () => {
  const { account } = useRedux(["account"]);
  const [isIdCopied, setIsIdCopied] = useState(false);
  const accountId = account.data?.id;

  return (
    <El>
      <El>
        <h2>Your account QR code</h2>
      </El>
      <El>
        Scan this QR code using a Stellar wallet app to make a payment to your
        account
      </El>
      <El>
        <QRCode value={accountId}></QRCode>
      </El>
      <El>{accountId}</El>
      <CopyToClipboard text={accountId} onCopy={() => setIsIdCopied(true)}>
        <TempButtonEl>{isIdCopied ? "Copied" : "Copy public key"}</TempButtonEl>
      </CopyToClipboard>
    </El>
  );
};
