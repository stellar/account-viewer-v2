import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const ModalEl = styled.div`
  position: fixed;
  background-color: #fff;
  z-index: 101;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  overflow: hidden;
`;

const ModalContentEl = styled.div`
  width: 80vw;
  max-width: 800px;
  max-height: 70vh;
  overflow-y: auto;
`;

const CloseButtonEl = styled.button``;

const BackgroundEl = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ visible, onClose, children }: ModalProps) => {
  if (!visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <ModalEl>
        <ModalContentEl>{children}</ModalContentEl>
        <CloseButtonEl onClick={onClose}>Close</CloseButtonEl>
      </ModalEl>
      <BackgroundEl onClick={onClose} />
    </>,
    document.body,
  );
};
