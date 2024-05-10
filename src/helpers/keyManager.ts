import { Transaction } from "stellar-sdk";
import {
  KeyManager,
  MemoryKeyStore,
  KeyType,
  IdentityEncrypter,
} from "@stellar/typescript-wallet-sdk-km";
import { getErrorString } from "helpers/getErrorString";

export interface CreateKeyManagerResponse {
  id: string;
  password: string;
  errorString?: string;
  custom?: {
    [key: string]: any;
  };
}

const createKeyManager = () => {
  const localKeyStore = new MemoryKeyStore();
  const keyManager = new KeyManager({ keyStore: localKeyStore });

  return keyManager;
};

export const storeKey = async ({
  publicKey,
  privateKey,
  keyType,
}: {
  publicKey: string;
  privateKey: string;
  keyType: KeyType;
}) => {
  const keyManager = createKeyManager();

  const result: CreateKeyManagerResponse = {
    id: "",
    password: "Stellar Development Foundation",
    errorString: undefined,
  };

  keyManager.registerEncrypter(IdentityEncrypter);

  try {
    const metaData = await keyManager.storeKey({
      key: {
        id: result.id,
        type: keyType,
        publicKey,
        privateKey,
      },
      password: result.password,
      encrypterName: "IdentityEncrypter",
    });

    result.id = metaData.id;
  } catch (error) {
    result.errorString = getErrorString(error);
    return result;
  }

  return result;
};

export const loadPrivateKey = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  const keyManager = createKeyManager();
  const result = await keyManager.loadKey(id, password);
  return result;
};

interface SignTransactionProps {
  id: string;
  password: string;
  transaction: Transaction;
  custom?: {
    [key: string]: any;
  };
}

export const signTransaction = ({
  id,
  password,
  transaction,
  custom,
}: // TODO: fix any type
SignTransactionProps): Promise<any> => {
  const keyManager = createKeyManager();

  return keyManager.signTransaction({
    id,
    password,
    transaction,
    custom,
  });
};
