import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StatusBar } from "@stellar/design-system";

import { updateSettingsAction } from "ducks/settings";
import { useRedux } from "hooks/useRedux";

export const Network = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { settings } = useRedux("settings");
  const queryParams = new URLSearchParams(useLocation().search);
  const testnetParam = queryParams.get("testnet");

  const isDevelopment = process.env.NODE_ENV === "development";
  const isTestnet = testnetParam === "true";
  const showNetworkMessage =
    (isDevelopment && !settings.isTestnet) ||
    (!isDevelopment && settings.isTestnet);

  useEffect(() => {
    if (testnetParam) {
      // route and store will reset when page reloads on query change
      dispatch(updateSettingsAction({ isTestnet }));
    }
  }, [isTestnet, dispatch, testnetParam]);

  return (
    <>
      {showNetworkMessage && (
        <StatusBar variant={StatusBar.variant.error}>{`You are using ${
          isTestnet ? "TEST" : "PUBLIC"
        } network in ${
          isDevelopment ? "DEVELOPMENT" : "PRODUCTION"
        }`}</StatusBar>
      )}
      {children}
    </>
  );
};
