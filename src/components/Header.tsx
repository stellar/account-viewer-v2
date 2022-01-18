import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Layout, Identicon, CopyText } from "@stellar/design-system";

import { resetStoreAction } from "config/store";
import { stopAccountWatcherAction } from "ducks/account";
import { stopTxHistoryWatcherAction } from "ducks/txHistory";
import { useRedux } from "hooks/useRedux";
import { getUserThemeSettings } from "helpers/getUserThemeSettings";
import { logEvent } from "helpers/tracking";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useRedux("account");
  const { isAuthenticated } = account;

  const getThemeTrackingParams = (isDarkMode?: boolean) => {
    const { prefersDarkMode, savedMode } = getUserThemeSettings(isDarkMode);

    return {
      "using system dark mode": Boolean(prefersDarkMode),
      "user set website theme": savedMode ?? "not set",
    };
  };

  useEffect(() => {
    logEvent("theme: initial page load", getThemeTrackingParams());
  }, []);

  const handleSignOut = () => {
    dispatch(stopAccountWatcherAction());
    dispatch(stopTxHistoryWatcherAction());
    dispatch(resetStoreAction());
    navigate("/");
  };

  const trackThemeChange = (isDarkMode: boolean) => {
    logEvent("theme: user changed", getThemeTrackingParams(isDarkMode));
  };

  const isSignedIn = isAuthenticated && account.data;

  return (
    <Layout.Header
      projectTitle="Account Viewer"
      projectLink="https://stellar.org"
      hasDarkModeToggle
      onDarkModeToggleEnd={trackThemeChange}
      onSignOut={isSignedIn ? handleSignOut : undefined}
      showButtonBorder
      contentCenter={
        isSignedIn ? (
          <div className="Header__account">
            <CopyText textToCopy={account.data!.id} showCopyIcon showTooltip>
              <Identicon publicAddress={account.data!.id} shortenAddress />
            </CopyText>
          </div>
        ) : undefined
      }
    ></Layout.Header>
  );
};
