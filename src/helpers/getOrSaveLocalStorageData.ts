type Props<T> = {
  storageId: string;
  storageDateId: string;
  getAccountsFunc: () => Promise<T>;
};

export const getOrSaveLocalStorageData = async <T>({
  storageId,
  storageDateId,
  getAccountsFunc,
}: Props<T>): Promise<T> => {
  let accounts: T;

  const date = new Date();
  const time = date.getTime();
  const sevenDaysAgo = time - 7 * 24 * 60 * 60 * 1000;
  const cachedDate = Number(localStorage.getItem(storageDateId));

  accounts = JSON.parse(localStorage.getItem(storageId) || "[]");

  // if data were last cached over seven days ago, make the request
  // cachedDate is coerced to 0 if not found in storage
  if (cachedDate < sevenDaysAgo) {
    try {
      accounts = await getAccountsFunc();
      // store the accounts plus the date we've acquired them
      localStorage.setItem(storageId, JSON.stringify(accounts));
      localStorage.setItem(storageDateId, time.toString());
    } catch (e) {
      throw new Error(`${storageId} accounts API did not respond`);
    }
  }

  return accounts;
};
