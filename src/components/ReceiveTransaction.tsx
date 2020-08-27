import React, { useState } from "react";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import QRCode from "qrcode.react";

import { ReactComponent as IconCopy } from "assets/svg/icon-copy.svg";

import { Avatar } from "components/Avatar";
import { TextButton } from "components/basic/TextButton";
import { ModalContent } from "components/ModalContent";
import { FONT_WEIGHT, PALETTE } from "constants/styles";
import { useRedux } from "hooks/useRedux";

const QRCodeWrapperEl = styled.div`
  margin: 2.5rem 0;
  display: flex;
  justify-content: center;
`;

const ContentWrapperEl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AddressWrapperEl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const AddressEl = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.black};
  word-break: break-all;
  margin-left: 1.5rem;
  max-width: 300px;
  flex: 1;
`;

export const ReceiveTransaction = () => {
  const { account } = useRedux(["account"]);
  const [isAccountIdCopied, setAccountIsIdCopied] = useState(false);
  const accountId = account.data?.id;

  return (
    <ModalContent headlineText="Your account QR code">
      <p>
        Scan this QR code using a Stellar wallet app to make a payment to your
        account.
      </p>

      <QRCodeWrapperEl>
        <QRCode value={accountId}></QRCode>
      </QRCodeWrapperEl>

      <ContentWrapperEl>
        <AddressWrapperEl>
          <Avatar publicAddress={accountId} />
          <AddressEl>{accountId}</AddressEl>
        </AddressWrapperEl>

        <CopyToClipboard
          text={accountId}
          onCopy={() => setAccountIsIdCopied(true)}
        >
          <TextButton icon={<IconCopy />}>
            {isAccountIdCopied ? "Copied" : "Copy public key"}
          </TextButton>
        </CopyToClipboard>
      </ContentWrapperEl>
    </ModalContent>
  );
};
