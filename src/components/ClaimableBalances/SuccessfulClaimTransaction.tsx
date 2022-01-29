import { Button, TextLink, Modal } from "@stellar/design-system";
import { useRedux } from "hooks/useRedux";
import { getNetworkConfig } from "helpers/getNetworkConfig";

export const SuccessfulClaimTransaction = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  const { sendTx, settings } = useRedux("sendTx", "settings");

  if (!sendTx.data) {
    return null;
  }

  return (
    <>
      <Modal.Heading>
        Claimable balance transaction successfully completed
      </Modal.Heading>

      <Modal.Body>
        <p className="align--center">
          <TextLink
            href={`${getNetworkConfig(settings.isTestnet).stellarExpertTxUrl}${sendTx.data.id
              }`}
          >
            See details on StellarExpert
          </TextLink>
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel} variant={Button.variant.secondary}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};
