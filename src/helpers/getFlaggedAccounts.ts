const UNSAFE_ACCOUNTS_URL =
  "https://api.stellar.expert/explorer/directory?limit=20000000&tag[]=malicious&tag[]=unsafe";
// setting limit very high as there doesn't appear to be a better way to get all
// entries from API
const RESPONSE_TIMEOUT = 5000;
// if API doesn't respond in this amount of time, we'll cancel the request

export const getFlaggedAccounts = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RESPONSE_TIMEOUT);

  const flaggedAccountsRes = await fetch(UNSAFE_ACCOUNTS_URL, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  const flaggedAccountsJson = await flaggedAccountsRes.json();

  const {
    _embedded: { records: unsafeAccountsData },
  } = flaggedAccountsJson;

  return unsafeAccountsData.map(
    ({ address, tags }: { address: string; tags: [] }) => ({ address, tags }),
  );
};
