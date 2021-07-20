import { Button, Modal } from "@stellar/design-system";
import { ErrorMessage } from "components/ErrorMessage";
import { useRedux } from "hooks/useRedux";

export const FailedTransaction = ({
  onEditTransaction,
  onCancel,
}: {
  onEditTransaction: () => void;
  onCancel: () => void;
}) => {
  const { sendTx } = useRedux("sendTx");

  return (
    <>
      <Modal.Heading>Transaction failed</Modal.Heading>

      <Modal.Body>
        <p>See details below for more information.</p>
        <ErrorMessage message={`Error: ${sendTx.errorString}`} />
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
