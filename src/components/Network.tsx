import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { PALETTE } from "constants/styles";
import { updateSettingsAction } from "ducks/settings";
import { useRedux } from "hooks/useRedux";

const BannerEl = styled.div`
  width: 100%;
  padding: 1rem 0;
  text-align: center;
  background-color: ${PALETTE.red};
  color: ${PALETTE.white};
  font-size: 1rem;
  line-height: 1.5rem;
`;

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
        <BannerEl>{`You are using ${isTestnet ? "TEST" : "PUBLIC"} network in ${
          isDevelopment ? "DEVELOPMENT" : "PRODUCTION"
        }`}</BannerEl>
      )}
      {children}
    </>
  );
};
