import { Button, Modal } from "@stellar/design-system";
import { ErrorMessage } from "components/ErrorMessage";
import { useRedux } from "hooks/useRedux";
import { AuthType } from "types/types";

export const FailedTransaction = ({
  onEditTransaction,
  onCancel,
}: {
  onEditTransaction: () => void;
  onCancel: () => void;
}) => {
  const { sendTx, settings } = useRedux("sendTx", "settings");

  return (
    <>
      <Modal.Heading>Transaction failed</Modal.Heading>

      <Modal.Body>
        <p>See details below for more information.</p>
        <ErrorMessage message={`Error: ${sendTx.errorString}`} />
        {settings.authType === AuthType.PRIVATE_KEY ? (
          <ErrorMessage
            message="The attempted operation may not be supported on this wallet yet."
            fontSize="var(--font-size-secondary)"
          />
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onEditTransaction}>Edit Transaction</Button>
        <Button onClick={onCancel} variant={Button.variant.secondary}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};
