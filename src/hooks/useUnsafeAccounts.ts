// @ts-nocheck
import { useEffect, useState } from "react";
import { FLAGGED_ACCOUNT_STORAGE_ID } from "constants/settings";

import { getFlaggedAccounts } from "helpers/getFlaggedAccounts";

interface FlaggedAccount {
  address: string;
  tags: [string];
}

interface FlaggedAccounts extends Array<FlaggedAccount> {}

export const useFlaggedAccounts = () => {
  const [flaggedAccounts, setFlaggedAccounts] = useState<FlaggedAccounts>([
    { address: "", tags: [] },
  ]);

  useEffect(() => {
    const fetchFlaggedAccounts = async () => {
      let accounts;

      try {
        accounts = await getFlaggedAccounts();
      } catch (e) {
        accounts =
          JSON.parse(localStorage.getItem(FLAGGED_ACCOUNT_STORAGE_ID)) || [];
      }
      setFlaggedAccounts(accounts);
      localStorage.setItem(
        FLAGGED_ACCOUNT_STORAGE_ID,
        JSON.stringify(accounts),
      );
    };
    fetchFlaggedAccounts();
  }, []);

  return { flaggedAccounts };
};
