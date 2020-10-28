import logoAlbedo from "assets/svg/logo-albedo.svg";
// TODO: update Lyra logo once we have it.
import logoLyra from "assets/images/logo-lyra.png";
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
  // TODO: update info
  lyra: {
    title: "Connect with Lyra",
    logoImg: logoLyra,
    logoImgAltText: "Lyra logo",
    modalType: ModalType.SIGNIN_LYRA,
    infoText:
      "Lyra is a browser extension wallet. Available on Chrome and Firefox.",
    infoLinkText: "Download",
    infoLink: "#",
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
