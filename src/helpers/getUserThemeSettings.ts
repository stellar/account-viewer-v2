import { LOCAL_STORAGE_STELLAR_THEME } from "constants/settings";
import { StellarThemeValue } from "types/types";

export const getUserThemeSettings = (isDarkMode?: boolean) => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  let savedMode = localStorage.getItem(LOCAL_STORAGE_STELLAR_THEME);

  // isDarkMode is coming from the toggle event
  if (isDarkMode !== undefined) {
    savedMode = isDarkMode ? StellarThemeValue.DARK : StellarThemeValue.LIGHT;
  }

  return {
    prefersDarkMode,
    savedMode,
  };
};
