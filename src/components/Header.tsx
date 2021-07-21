import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Layout, Identicon } from "@stellar/design-system";

import { resetStoreAction } from "config/store";
import { CopyWithTooltip } from "components/CopyWithTooltip";
import { stopAccountWatcherAction } from "ducks/account";
import { stopTxHistoryWatcherAction } from "ducks/txHistory";
import { useRedux } from "hooks/useRedux";

export const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { account } = useRedux("account");
  const { isAuthenticated } = account;

  const handleSignOut = () => {
    dispatch(stopAccountWatcherAction());
    dispatch(stopTxHistoryWatcherAction());
    dispatch(resetStoreAction());
    history.push({
      pathname: "/",
    });
  };

  const isSignedIn = isAuthenticated && account.data;

  return (
    <Layout.Header
      projectTitle="Account Viewer"
      projectLink="https://stellar.org"
      hasDarkModeToggle
      onSignOut={isSignedIn ? handleSignOut : undefined}
      showButtonBorder
    >
      {isSignedIn && (
        <div className="Header__account">
          <CopyWithTooltip copyText={account.data!.id} showCopyIcon>
            <Identicon publicAddress={account.data!.id} shortenAddress />
          </CopyWithTooltip>
        </div>
      )}
    </Layout.Header>
  );
};
