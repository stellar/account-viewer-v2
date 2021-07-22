import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Icon } from "@stellar/design-system";
import { Tooltip } from "components/Tooltip";
import "./styles.scss";

enum TooltipPosition {
  bottom = "bottom",
  right = "right",
}

interface CopyWithTooltipComponent {
  tooltipPosition: typeof TooltipPosition;
}

interface CopyWithTooltipProps {
  copyText: string;
  tooltipLabel?: string;
  tooltipPosition?: TooltipPosition;
  showCopyIcon?: boolean;
  children: React.ReactNode;
}

export const CopyWithTooltip: React.FC<CopyWithTooltipProps> &
  CopyWithTooltipComponent = ({
  copyText,
  tooltipLabel = "Copied",
  tooltipPosition = TooltipPosition.bottom,
  showCopyIcon,
  children,
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
    <div className="CopyWithTooltip">
      <CopyToClipboard text={copyText} onCopy={handleCopyDone}>
        <div title="Copy" role="button" className="CopyWithTooltip__content">
          {children}

          {showCopyIcon ? (
            <div className="CopyWithTooltip__content__copy-icon">
              <Icon.Copy />
            </div>
          ) : null}
        </div>
      </CopyToClipboard>

      <Tooltip
        className={`CopyWithTooltip__tooltip CopyWithTooltip__tooltip--${tooltipPosition}`}
        isVisible={isTooltipVisible}
      >
        {tooltipLabel}
      </Tooltip>
    </div>
  );
};

CopyWithTooltip.displayName = "CopyWithTooltip";
CopyWithTooltip.tooltipPosition = TooltipPosition;
