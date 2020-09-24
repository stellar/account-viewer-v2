import React, { useState } from "react";
import styled, { css } from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";

import { PALETTE, tooltipStyle } from "constants/styles";

export enum TooltipPosition {
  bottom = "bottom",
  right = "right",
}

const ContentEl = styled.div`
  cursor: pointer;
  position: relative;
`;

const TootltipEl = styled.div<{
  isVisible: boolean;
  position: TooltipPosition;
}>`
  ${tooltipStyle};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  padding: 0.5rem 1rem;
  background-color: ${PALETTE.charcoal};

  ${(props) =>
    props.position === TooltipPosition.bottom &&
    css`
      right: 50%;
      transform: translateX(50%);
    `};

  ${(props) =>
    props.position === TooltipPosition.right &&
    css`
      top: 50%;
      transform: translate(100%, -50%);
    `}
`;

interface CopyWithTooltipProps {
  copyText: string;
  tooltipLabel?: string;
  tooltipPosition?: TooltipPosition;
  children: React.ReactNode;
}

export const CopyWithTooltip = ({
  copyText,
  tooltipLabel = "Copied",
  tooltipPosition = TooltipPosition.bottom,
  children,
}: CopyWithTooltipProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleCopyDone = () => {
    if (isTooltipVisible) {
      return;
    }

    setIsTooltipVisible(true);

    const t = setTimeout(() => {
      setIsTooltipVisible(false);
      clearTimeout(t);
    }, 1000);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={handleCopyDone}>
      <ContentEl>
        {children}
        <TootltipEl isVisible={isTooltipVisible} position={tooltipPosition}>
          {tooltipLabel}
        </TootltipEl>
      </ContentEl>
    </CopyToClipboard>
  );
};
