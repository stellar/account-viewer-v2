import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Heading2, Identicon, Layout, TextLink } from "@stellar/design-system";
import { fetchClaimableBalancesAction } from "ducks/claimableBalances";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { formatAmount } from "helpers/formatAmount";
import { useRedux } from "hooks/useRedux";

export const ClaimableBalances = () => {
  const { account, claimableBalances, settings } = useRedux(
    "account",
    "claimableBalances",
    "settings",
  );
  const accountId = account.data?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchClaimableBalancesAction(accountId));
    }
  }, [accountId, dispatch]);

  if (!claimableBalances?.data.length) {
    return null;
  }

  return (
    <div className="ClaimableBalances DataSection">
      <Layout.Inset>
        <Heading2>Claimable Balances</Heading2>

        <div className="TableContainer">
          <table className="Table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
                <th>Sponsor</th>
              </tr>
            </thead>
            <tbody>
              {claimableBalances.data.map((cb) => (
                <tr key={cb.id}>
                  <td>
                    <TextLink
                      href={`${
                        getNetworkConfig(settings.isTestnet)
                          .stellarExpertAssetUrl
                      }${cb.asset.code}-${cb.asset.issuer}`}
                      variant={TextLink.variant.secondary}
                      underline
                    >
                      {cb.asset.code}
                    </TextLink>
                  </td>
                  <td>{formatAmount(cb.amount)}</td>
                  <td className="Table__cell--align--right">
                    <Identicon publicAddress={cb.sponsor} shortenAddress />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout.Inset>
    </div>
  );
};
