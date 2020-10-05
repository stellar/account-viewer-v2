import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { PALETTE, tooltipStyle } from "constants/styles";
import { ReactComponent as InfoIcon } from "assets/svg/icon-info.svg";

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
  ${tooltipStyle};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};

  a {
    color: inherit;
  }
`;

export const InfoButtonWithTooltip = ({
  children,
}: {
  children: string | React.ReactNode;
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
    // Do nothing if clicking tooltip itself or link inside the tooltip
    if (
      event.target === infoEl?.current ||
      infoEl?.current?.contains(event.target as Node)
    ) {
      return;
    }

    if (!toggleEl?.current?.contains(event.target as Node)) {
      setIsInfoVisible(false);
    }
  };

  return (
    <>
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
        {children}
      </InfoEl>
    </>
  );
};
