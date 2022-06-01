import { MemoRequiredAccountsResponse, MemoRequiredAccount } from "types/types";

// setting limit very high as there doesn't appear to be a better way to get all
// entries from API
const KNOWN_ACCOUNTS_URL =
  "https://api.stellar.expert/explorer/directory?limit=20000000&tag[]=memo-required";
// if API doesn't respond in this amount of time, we'll cancel the request
const RESPONSE_TIMEOUT = 5000;

// eslint-disable-next-line max-len
export const getMemoRequiredAccounts =
  async (): Promise<MemoRequiredAccountsResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RESPONSE_TIMEOUT);

    const knownAccountsResponse = await fetch(KNOWN_ACCOUNTS_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let knownAccountsResult = {};

    if (knownAccountsResponse.ok) {
      const data = await knownAccountsResponse.json();
      knownAccountsResult = data?._embedded?.records.reduce(
        (result: MemoRequiredAccountsResponse, item: MemoRequiredAccount) => ({
          ...result,
          [item.address]: {
            address: item.address,
            name: item.name,
            domain: item.domain,
          },
        }),
        {},
      );
    }

    return knownAccountsResult;
  };
