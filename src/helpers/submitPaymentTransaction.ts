import StellarSdk, {
  Transaction,
  MemoType,
  MemoValue,
  Keypair,
} from "stellar-sdk";
import { PaymentTransactionParams } from "ducks/sendTransaction";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "App";

export const submitPaymentTransaction = async (
  params: PaymentTransactionParams,
) => {
  const { settings } = store.getState();
  const server = new StellarSdk.Server(
    getNetworkConfig(settings.isTestnet).url,
  );

  const keypair = Keypair.fromSecret(params.secret);
  let transaction = await buildPaymentTransaction(params);
  transaction = await signTransaction(transaction, keypair);

  const result = await server.submitTransaction(transaction);
  return result;
};

export const signTransaction = async (
  transaction: Transaction,
  keypair: Keypair,
) => {
  try {
    await transaction.sign(keypair);
  } catch (err) {
    throw new Error(`Failed to sign transaction, error: ${err.toString()}`);
  }
  return transaction;
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

export const buildPaymentTransaction = async ({
  secret,
  toAccountId,
  amount,
  fee,
  memoType,
  memoContent,
}: PaymentTransactionParams) => {
  let transaction;
  try {
    const { settings } = store.getState();
    const server = new StellarSdk.Server(
      getNetworkConfig(settings.isTestnet).url,
    );
    const keypair = Keypair.fromSecret(secret);
    const sequence = (await server.loadAccount(keypair.publicKey())).sequence;
    const source = await new StellarSdk.Account(keypair.publicKey(), sequence);

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
  } catch (err) {
    throw new Error(`Failed to build transaction, error: ${err.toString()})}`);
  }
  return transaction;
};
