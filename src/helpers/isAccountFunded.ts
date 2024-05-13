export const isAccountFunded = async (
  publicKey: string,
  isTestnet: boolean,
) => {
  const url = `https://${
    isTestnet ? "horizon-testnet.stellar.org" : "horizon.stellar.org"
  }/accounts/${publicKey}`;

  const request = await fetch(url);
  const response = await request.json();

  return Boolean(response.account_id);
};
