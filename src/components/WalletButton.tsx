import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { PALETTE, Z_INDEXES } from "constants/styles";
import { ReactComponent as InfoIcon } from "assets/icons/icon-info.svg";

const WrapperEl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-width: 250px;
`;

const ButtonEl = styled.div`
  flex: 1;
  border: 1px solid ${PALETTE.white40};
  border-radius: 0.25rem;
  background-color: ${PALETTE.white};
  padding: 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    height: 1.5rem;
    margin-right: 0.75rem;
  }
`;

const LabelEl = styled.span`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
  padding-top: 0.1875rem;
`;

const InfoButtonEl = styled.div`
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.875rem;

  svg {
    width: 100%;
    height: 100%;
    fill: ${PALETTE.grey};
  }
`;

const InfoEl = styled.div<{ isVisible: boolean }>`
  position: absolute;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  top: 2.7rem;
  right: -1rem;
  max-width: 300px;
  border-radius: 0.25rem;
  background-color: ${PALETTE.purple};
  padding: 1rem 1.5rem;
  color: ${PALETTE.white80};
  font-size: 0.875rem;
  line-height: 1.5rem;
  z-index: ${Z_INDEXES.tooltip};
`;

interface WalletButtonProps {
  imageSrc: string;
  imageAlt: string;
  infoText: string;
  onClick: () => void;
  children: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  imageSrc,
  imageAlt,
  infoText,
  onClick,
  children,
  ...props
}) => {
  const toggleEl = useRef<null | HTMLDivElement>(null);
  const infoEl = useRef<null | HTMLDivElement>(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    if (isInfoVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInfoVisible]);

  const handleClickOutside = (event: MouseEvent) => {
    if (event.target === infoEl?.current) {
      return;
    }

    if (!toggleEl?.current?.contains(event.target as Node)) {
      setIsInfoVisible(false);
    }
  };

  return (
    <WrapperEl>
      <ButtonEl onClick={onClick} role="button" {...props}>
        <img src={imageSrc} alt={imageAlt} />
        <LabelEl>{children}</LabelEl>
      </ButtonEl>

      <InfoButtonEl
        ref={toggleEl}
        onClick={() => setIsInfoVisible((currentState) => !currentState)}
      >
        <InfoIcon />
      </InfoButtonEl>

      <InfoEl
        ref={infoEl}
        data-hidden={!isInfoVisible}
        isVisible={isInfoVisible}
      >
        {infoText}
      </InfoEl>
    </WrapperEl>
  );
};
