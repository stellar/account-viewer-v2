import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { ReactComponent as IconClose } from "assets/svg/icon-close.svg";
import {
  MODAL_OPEN_CLASS_NAME,
  PALETTE,
  SCREEN_SIZES,
  Z_INDEXES,
} from "constants/styles";

const MODAL_MAX_WIDTH = "650px";
const MIN_SCREEN_HEIGHT = "700px";

const ModalEl = styled.div`
  position: fixed;
  background-color: ${PALETTE.white};
  border-radius: 0;
  z-index: ${Z_INDEXES.modal + 1};
  top: 0;
  left: 0;
  transform: translate(0, 0);
  padding: 4.5rem 1.5rem 2rem;
  overflow: hidden;
  box-shadow: 0 1.5rem 3rem -1.5rem rgba(0, 0, 0, 0.16);

  @media (min-width: ${MODAL_MAX_WIDTH}) and (min-height: ${MIN_SCREEN_HEIGHT}) {
    top: 20%;
    left: 50%;
    transform: translate(-50%, -20%);
    border-radius: 0.5rem;
  }
`;

const ModalContentEl = styled.div`
  min-width: calc(${SCREEN_SIZES.min}px - 3rem);
  width: calc(100vw - 3rem);
  height: calc(100vh - 6.5rem);
  overflow-y: auto;

  @media (min-width: ${MODAL_MAX_WIDTH}) and (min-height: ${MIN_SCREEN_HEIGHT}) {
    width: 80vw;
    height: auto;
    max-width: ${MODAL_MAX_WIDTH};
    max-height: 80vh;
  }
`;

const CloseButtonEl = styled.button`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 1rem;
  right: 0.75rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 1rem;
    height: 1rem;
    fill: ${PALETTE.black80};
  }
`;

const BackgroundEl = styled.div`
  position: fixed;
  background-color: ${PALETTE.black};
  opacity: 0.24;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${Z_INDEXES.modal};
`;

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ visible, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (visible) {
      document.body.classList.add(MODAL_OPEN_CLASS_NAME);
    } else {
      document.body.classList.remove(MODAL_OPEN_CLASS_NAME);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <ModalEl>
        <ModalContentEl>{children}</ModalContentEl>
        <CloseButtonEl onClick={onClose}>
          <IconClose />
        </CloseButtonEl>
      </ModalEl>
      <BackgroundEl onClick={onClose} />
    </>,
    document.body,
  );
};
