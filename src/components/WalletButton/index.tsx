import { InfoButtonWithTooltip } from "components/InfoButtonWithTooltip";
import "./styles.scss";

interface WalletButtonProps {
  imageSvg: React.ReactNode;
  infoText: string | React.ReactNode;
  onClick: () => void;
  children: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  imageSvg,
  infoText,
  onClick,
  children,
  ...props
}) => (
  <div className="WalletButton">
    <button className="WalletButton__button" onClick={onClick} {...props}>
      {imageSvg}
      <span className="WalletButton__label">{children}</span>
    </button>

    <InfoButtonWithTooltip>{infoText}</InfoButtonWithTooltip>
  </div>
);
