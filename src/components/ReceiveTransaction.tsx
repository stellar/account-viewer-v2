import QRCode from "qrcode.react";
import { Modal, Identicon, CopyText, IconButton } from "@stellar/design-system";
import { useRedux } from "hooks/useRedux";

export const ReceiveTransaction = () => {
  const { account } = useRedux("account");

  if (!account.data) {
    return null;
  }

  const accountId = account.data.id;

  return (
    <>
      <Modal.Heading>Your account QR code</Modal.Heading>

      <Modal.Body>
        <p className="align--center">
          Scan this QR code using a Stellar wallet app to make a payment to your
          account.
        </p>

        <div className="ReceiveModal__share">
          <div className="ReceiveModal__share__qrcode">
            <QRCode value={accountId}></QRCode>
          </div>

          <Identicon publicAddress={accountId} />

          <div className="CopyKey-container">
            <CopyText
              textToCopy={accountId}
              showTooltip
              tooltipPosition={CopyText.tooltipPosition.RIGHT}
            >
              <IconButton
                preset={IconButton.preset.copy}
                variant={IconButton.variant.highlight}
                label="Copy public key"
              />
            </CopyText>
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
