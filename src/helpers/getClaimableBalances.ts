import { ClaimableBalance, ClaimableBalanceRecord } from "types/types";

interface GetClaimableBalancesProps {
  server: any;
  publicKey: string;
}

export const getClaimableBalances = async ({
  server,
  publicKey,
}: GetClaimableBalancesProps): Promise<ClaimableBalance[]> => {
  const claimableBalancesResponse = await server
    .claimableBalances()
    .claimant(publicKey)
    .call();

  return (claimableBalancesResponse.records || []).map(
    (cb: ClaimableBalanceRecord) => {
      const { id, asset, amount, sponsor } = cb;
      const [assetCode, assetIssuer] = asset.split(":");

      return {
        id,
        asset: {
          code: assetCode,
          issuer: assetIssuer,
        },
        amount,
        sponsor,
      };
    },
  );
};
