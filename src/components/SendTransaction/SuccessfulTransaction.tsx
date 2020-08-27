import React from "react";
import styled from "styled-components";
import { Button, ButtonVariant } from "components/basic/Button";
import { TextLink } from "components/basic/TextLink";
import { ModalContent } from "components/ModalContent";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";

const ContentEl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SuccessfulTransaction = ({
  onRestartFlow,
  onCancel,
}: {
  onRestartFlow: () => void;
  onCancel: () => void;
}) => {
  const { sendTx, settings } = useRedux("sendTx", "settings");

  return (
    <ModalContent
      headlineText="Transaction successfully completed"
      buttonFooter={
        <>
          <Button onClick={onRestartFlow}>Send another payment</Button>
          <Button onClick={onCancel} variant={ButtonVariant.secondary}>
            Close
          </Button>
        </>
      }
    >
      <ContentEl>
        <TextLink
          href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${
            sendTx.data.id
          }`}
          target="_blank"
        >
          See details on StellarExpert
        </TextLink>
      </ContentEl>
    </ModalContent>
  );
};
