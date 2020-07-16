import { KeyManager, KeyManagerPlugins, KeyType } from "@stellar/wallet-sdk";
import { Keypair, Networks } from "stellar-sdk";

// To load privateKey: (keyStore from Redux)
// await keyStore.keyManager.loadKey( keyStore.id, keyStore.password );

export interface CreateKeyManagerResponse {
  keyManager?: KeyManager;
  id: string;
  password: string;
  errorMessage?: string;
}

const createKeyManager = () => {
  const keyManager = new KeyManager({
    keyStore: new KeyManagerPlugins.MemoryKeyStore(),
    // TODO - network config
    defaultNetworkPassphrase: Networks.TESTNET,
  });

  keyManager.registerEncrypter(KeyManagerPlugins.ScryptEncrypter);
  return keyManager;
};

export const storePrivateKey = async (secret: string) => {
  const keyPair = Keypair.fromSecret(secret);
  const keyManager = createKeyManager();

  const result: CreateKeyManagerResponse = {
    keyManager: undefined,
    id: "",
    password: "Stellar Development Foundation",
    errorMessage: undefined,
  };

  try {
    const metaData = await keyManager.storeKey({
      key: {
        type: KeyType.plaintextKey,
        publicKey: keyPair.publicKey(),
        privateKey: keyPair.secret(),
        // TODO - network config
        network: Networks.TESTNET,
      },
      password: result.password,
      encrypterName: KeyManagerPlugins.ScryptEncrypter.name,
    });

    result.id = metaData.id;
    result.keyManager = keyManager;
  } catch (err) {
    result.errorMessage = err;
    return result;
  }

  return result;
};
