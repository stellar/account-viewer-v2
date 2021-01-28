import logoAlbedo from "assets/svg/logo-albedo.svg";
import logoFreighter from "assets/svg/logo-freighter.svg";
import logoLedger from "assets/svg/logo-ledger.svg";
import logoTrezor from "assets/svg/logo-trezor.svg";
import { ModalType, Wallets } from "types/types.d";

export const wallets: Wallets = {
  albedo: {
    title: "Connect with Albedo",
    logoImg: logoAlbedo,
    logoImgAltText: "Albedo logo",
    modalType: ModalType.SIGNIN_ALBEDO,
    infoText: "Albedo is a browser wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://albedo.link",
  },
  freighter: {
    title: "Connect with Freighter",
    logoImg: logoFreighter,
    logoImgAltText: "Freighter logo",
    modalType: ModalType.SIGNIN_FREIGHTER,
    infoText: "Freighter is a browser extension wallet. Available on Chrome.",
    infoLinkText: "Download",
    infoLink: "https://freighter.app",
  },
  ledger: {
    title: "Connect with Ledger",
    logoImg: logoLedger,
    logoImgAltText: "Ledger logo",
    modalType: ModalType.SIGNIN_LEDGER,
    infoText: "Ledger is a Stellar-compatible hardware wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://www.ledger.com",
  },
  trezor: {
    title: "Connect with Trezor",
    logoImg: logoTrezor,
    logoImgAltText: "Trezor logo",
    modalType: ModalType.SIGNIN_TREZOR,
    infoText: "Trezor is a Stellar-compatible hardware wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://trezor.io",
  },
};
