import React, { useState } from "react";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";

import { ReactComponent as IconCopy } from "assets/svg/icon-copy.svg";
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  PALETTE,
  tooltipStyle,
} from "constants/styles";
import { getFormattedPublicKey } from "helpers/getFormattedPublicKey";

const CopyPublicKeyButtonEl = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 0.75rem;
  margin-right: 0;
  margin-top: 0.25rem;
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.black};

  svg {
    fill: ${PALETTE.purple};
    height: 1.25rem;
    width: 1.25rem;
    margin-left: 0.75rem;
    margin-top: -0.25rem;
  }

  &::after {
    content: "";
    cursor: default;
    display: none;
    width: 1px;
    height: 2rem;
    background-color: ${PALETTE.grey};
    position: absolute;
    top: -0.2rem;
    right: -1.5rem;
  }

  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    margin-right: 2.6rem;

    &::after {
      display: block;
    }
  }
`;

const TootltipEl = styled.div<{ isVisible: boolean }>`
  ${tooltipStyle};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  top: 2rem;
  right: 0;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background-color: ${PALETTE.charcoal};
`;

export const CopyPublicAddress = ({
  publicAddress,
}: {
  publicAddress: string;
}) => {
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
    <CopyToClipboard text={publicAddress} onCopy={handleCopyDone}>
      <CopyPublicKeyButtonEl>
        {getFormattedPublicKey(publicAddress)}
        <IconCopy />
        <TootltipEl isVisible={isTooltipVisible}>Copied</TootltipEl>
      </CopyPublicKeyButtonEl>
    </CopyToClipboard>
  );
};
