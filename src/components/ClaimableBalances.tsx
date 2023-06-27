import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Heading2,
  Identicon,
  Layout,
  TextLink,
  Table,
} from "@stellar/design-system";
import { NATIVE_ASSET_CODE } from "constants/settings";
import { AppDispatch } from "config/store";
import { fetchClaimableBalancesAction } from "ducks/claimableBalances";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { formatAmount } from "helpers/formatAmount";
import { useRedux } from "hooks/useRedux";
import { AssetType } from "types/types";

export const ClaimableBalances = () => {
  const { account, claimableBalances, settings } = useRedux(
    "account",
    "claimableBalances",
    "settings",
  );
  const accountId = account.data?.id;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchClaimableBalancesAction(accountId));
    }
  }, [accountId, dispatch]);

  if (!claimableBalances?.data.length) {
    return null;
  }

  const getAssetLink = (asset: { code: string; issuer: string }) => {
    let assetString;

    if (asset.code === AssetType.NATIVE) {
      assetString = NATIVE_ASSET_CODE;
    } else {
      assetString = `${asset.code}-${asset.issuer}`;
    }

    return `${
      getNetworkConfig(settings.isTestnet).stellarExpertAssetUrl
    }${assetString}`;
  };

  return (
    <div className="ClaimableBalances DataSection">
      <Layout.Inset>
        <Heading2>Claimable Balances</Heading2>

        <Table
          columnLabels={[
            { id: "cb-asset", label: "Asset" },
            { id: "cb-amount", label: "Amount" },
            { id: "cb-sponsor", label: "Sponsor" },
          ]}
          data={claimableBalances.data}
          renderItemRow={(cb) => (
            <>
              <td>
                <TextLink
                  href={getAssetLink(cb.asset)}
                  variant={TextLink.variant.secondary}
                  underline
                >
                  {cb.asset.code === AssetType.NATIVE
                    ? NATIVE_ASSET_CODE
                    : cb.asset.code}
                </TextLink>
              </td>
              <td>{formatAmount(cb.amount)}</td>
              <td className="Table__cell--align--right">
                <Identicon publicAddress={cb.sponsor} shortenAddress />
              </td>
            </>
          )}
          hideNumberColumn
        />
      </Layout.Inset>
    </div>
  );
};
