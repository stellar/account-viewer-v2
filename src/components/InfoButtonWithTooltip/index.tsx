import React, { useRef, useEffect, useState } from "react";
import { IconButton, Icon } from "@stellar/design-system";
import { Tooltip } from "components/Tooltip";
import "./styles.scss";

interface InfoButtonWithTooltipProps {
  children: string | React.ReactNode;
}

export const InfoButtonWithTooltip: React.FC<InfoButtonWithTooltipProps> = ({
  children,
}) => {
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

    const parent = infoEl?.current?.closest(".WalletButton");

    if (!parent?.contains(event.target as Node)) {
      setIsInfoVisible(false);
    }
  };

  return (
    <>
      <IconButton
        icon={<Icon.Info />}
        altText="View more information"
        onClick={() => setIsInfoVisible((currentState) => !currentState)}
      />

      <Tooltip
        className="InfoButtonWithTooltip__tooltip"
        isVisible={isInfoVisible}
        ref={infoEl}
      >
        {children}
      </Tooltip>
    </>
  );
};
