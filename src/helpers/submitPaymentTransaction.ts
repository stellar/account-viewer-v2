import StellarSdk, { MemoType, MemoValue, Keypair } from "stellar-sdk";
import { AuthType } from "constants/types.d";
import { PaymentTransactionParams } from "ducks/sendTransaction";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";
import { signTransaction } from "helpers/keyManager";

export const submitPaymentTransaction = async (
  params: PaymentTransactionParams,
  authType?: AuthType,
) => {
  const { settings, keyStore } = store.getState();
  const server = new StellarSdk.Server(
    getNetworkConfig(settings.isTestnet).url,
  );

  if (!authType) {
    throw new Error(`Bad authentication`);
  }

  let transaction = await buildPaymentTransaction(params);

  // Sign transaction
  try {
    if (authType === AuthType.PRIVATE_KEY) {
      transaction = transaction.sign(Keypair.fromSecret(params.secret));
    } else {
      // Ledger, Trezor
      transaction = await signTransaction({
        id: keyStore.keyStoreId,
        password: keyStore.password,
        transaction,
      });
    }
  } catch (error) {
    throw new Error(
      `Failed to sign transaction, error: ${getErrorString(error)}`,
    );
  }

  const result = await server.submitTransaction(transaction);
  return result;
};

const createMemo = (memoType: MemoType, memoContent: MemoValue) => {
  switch (memoType) {
    case StellarSdk.MemoText:
      return StellarSdk.Memo.text(memoContent);
    case StellarSdk.MemoID:
      return StellarSdk.Memo.id(memoContent);
    case StellarSdk.MemoHash:
      return StellarSdk.Memo.hash(memoContent);
    case StellarSdk.MemoReturn:
      return StellarSdk.Memo.return(memoContent);
    case StellarSdk.MemoNone:
    default:
      return StellarSdk.Memo.none();
  }
};

export const buildPaymentTransaction = async (
  params: PaymentTransactionParams,
) => {
  let transaction;
  try {
    const {
      publicKey,
      amount,
      fee,
      toAccountId,
      memoContent,
      memoType,
    } = params;
    const { settings } = store.getState();
    const server = new StellarSdk.Server(
      getNetworkConfig(settings.isTestnet).url,
    );
    const sequence = (await server.loadAccount(publicKey)).sequence;
    const source = await new StellarSdk.Account(publicKey, sequence);

    transaction = new StellarSdk.TransactionBuilder(source, {
      fee,
      networkPassphrase: getNetworkConfig(settings.isTestnet).network,
      timebounds: await server.fetchTimebounds(100),
    }).addOperation(
      StellarSdk.Operation.payment({
        destination: toAccountId,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      }),
    );

    if (memoType !== StellarSdk.MemoNone) {
      transaction = transaction.addMemo(createMemo(memoType, memoContent));
    }

    transaction = transaction.build();
  } catch (error) {
    throw new Error(
      `Failed to build transaction, error: ${getErrorString(error)})}`,
    );
  }
  return transaction;
};
