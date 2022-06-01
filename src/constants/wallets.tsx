import { Logo } from "@stellar/design-system";
import { ModalType, Wallets } from "types/types";

export const wallets: Wallets = {
  albedo: {
    title: "Connect with Albedo",
    logoSvg: <Logo.Albedo />,
    modalType: ModalType.SIGNIN_ALBEDO,
    infoText: "Albedo is a browser wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://albedo.link",
  },
  freighter: {
    title: "Connect with Freighter",
    logoSvg: <Logo.Freighter />,
    modalType: ModalType.SIGNIN_FREIGHTER,
    infoText:
      "Freighter is a browser extension wallet. Available on Chrome and Firefox.",
    infoLinkText: "Download",
    infoLink: "https://freighter.app",
  },
  ledger: {
    title: "Connect with Ledger",
    logoSvg: <Logo.Ledger />,
    modalType: ModalType.SIGNIN_LEDGER,
    infoText: "Ledger is a Stellar-compatible hardware wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://www.ledger.com",
  },
  trezor: {
    title: "Connect with Trezor",
    logoSvg: <Logo.Trezor />,
    modalType: ModalType.SIGNIN_TREZOR,
    infoText: "Trezor is a Stellar-compatible hardware wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://trezor.io",
  },
};
