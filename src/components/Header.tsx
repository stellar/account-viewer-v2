import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import createStellarIdenticon from "stellar-identicon-js";

import { ReactComponent as StellarLogo } from "assets/icons/logo-stellar.svg";
import { ReactComponent as IconCopy } from "assets/icons/icon-copy.svg";
import { resetStoreAction } from "config/store";
import { TextButton } from "components/basic/TextButton";
import {
  FONT_WEIGHT,
  HEADER_HEIGHT_REM,
  HEADER_VERTICAL_PADDING_REM,
  MEDIA_QUERIES,
  pageInsetStyle,
  PALETTE,
} from "constants/styles";
import { stopAccountWatcherAction } from "ducks/account";
import { stopTxHistoryWatcherAction } from "ducks/txHistory";
import { getFormattedPublicKey } from "helpers/getFormattedPublicKey";
import { useRedux } from "hooks/useRedux";

const WrapperEl = styled.div`
  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    padding: ${HEADER_VERTICAL_PADDING_REM}rem 0;
  }
`;

const InsetEl = styled.div`
  ${pageInsetStyle};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const BaseEl = styled.div`
  height: ${HEADER_HEIGHT_REM}rem;
  display: flex;
  align-items: center;
`;

const LogoWrapperEl = styled(BaseEl)``;

const AccountWrapperEl = styled(BaseEl)`
  justify-content: center;
  order: 1;
  width: 100%;

  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    width: auto;
    order: 0;
    flex: 1;
    justify-content: flex-end;
  }
`;

const SignOutWrapperEl = styled(BaseEl)``;

const AVLogoEl = styled.div`
  background-color: ${PALETTE.purple};
  color: ${PALETTE.white};
  text-transform: uppercase;
  font-size: 0.875rem;
  line-height: 1.125rem;
  font-weight: ${FONT_WEIGHT.medium};
  padding: 0.2rem 0.375rem 0.125rem;
  border-radius: 0.125rem;
`;

const LogoLinkEl = styled.a`
  display: block;
  overflow: hidden;
  height: 1.5rem;
  width: 1.9rem;
  margin-right: 0.75rem;

  @media (min-width: 600px) {
    width: 6rem;
  }

  svg {
    color: ${PALETTE.black};
    height: 100%;
    width: 6rem;
  }
`;

const CopyPublicKeyButtonEl = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 0.75rem;
  margin-right: 0;
  margin-top: 0.25rem;
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: ${PALETTE.black};

  svg {
    fill: ${PALETTE.purple};
    height: 1.25rem;
    width: 1.25rem;
    margin-left: 0.75rem;
    margin-top: -0.25rem;
  }

  &::after {
    content: "";
    cursor: default;
    display: none;
    width: 1px;
    height: 2rem;
    background-color: ${PALETTE.grey};
    position: absolute;
    top: -0.2rem;
    right: -1.5rem;
  }

  @media (${MEDIA_QUERIES.headerFooterHeight}) {
    margin-right: 2.6rem;

    &::after {
      display: block;
    }
  }
`;

const AvatarWrapperEl = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: ${PALETTE.white80};
  border: 1px solid ${PALETTE.white60};
  border-radius: 1.5rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const Header = () => {
  const dispatch = useDispatch();
  const { account } = useRedux(["account"]);
  const { isAuthenticated } = account;
  const identiconCanvas = account.data?.id
    ? createStellarIdenticon(account.data.id)
    : null;

  const handleSignOut = () => {
    dispatch(stopAccountWatcherAction());
    dispatch(stopTxHistoryWatcherAction());
    dispatch(resetStoreAction());
  };

  const handleCopyPublicKey = () => {
    console.log("copy public key");
  };

  return (
    <WrapperEl>
      <InsetEl>
        <LogoWrapperEl>
          <LogoLinkEl href="https://www.stellar.org/">
            <StellarLogo />
          </LogoLinkEl>
          <AVLogoEl>Account Viewer</AVLogoEl>
        </LogoWrapperEl>

        {isAuthenticated && (
          <>
            <AccountWrapperEl>
              {identiconCanvas && (
                <AvatarWrapperEl>
                  <img src={identiconCanvas.toDataURL()} alt="Your identicon" />
                </AvatarWrapperEl>
              )}
              <CopyPublicKeyButtonEl
                role="button"
                onClick={handleCopyPublicKey}
              >
                {getFormattedPublicKey(account.data.id)}
                <IconCopy />
              </CopyPublicKeyButtonEl>
            </AccountWrapperEl>
            <SignOutWrapperEl>
              <TextButton onClick={handleSignOut}>Sign out</TextButton>
            </SignOutWrapperEl>
          </>
        )}
      </InsetEl>
    </WrapperEl>
  );
};
