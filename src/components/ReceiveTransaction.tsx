import QRCode from "qrcode.react";
import { TextLink, Modal, Icon, Identicon } from "@stellar/design-system";

import { CopyWithTooltip } from "components/CopyWithTooltip";
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
            <CopyWithTooltip
              copyText={accountId}
              tooltipPosition={CopyWithTooltip.tooltipPosition.right}
            >
              <TextLink iconLeft={<Icon.Copy />}>Copy public key</TextLink>
            </CopyWithTooltip>
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
