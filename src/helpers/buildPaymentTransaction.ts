import {
  Account,
  Asset,
  Memo,
  MemoHash,
  MemoID,
  MemoNone,
  MemoReturn,
  MemoText,
  MemoType,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import { PaymentTransactionParams } from "ducks/sendTx";
import { getErrorString } from "helpers/getErrorString";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { store } from "config/store";

const createMemo = (memoType: MemoType, memoContent: string) => {
  switch (memoType) {
    case MemoText:
      return Memo.text(memoContent);
    case MemoID:
      return Memo.id(memoContent);
    case MemoHash:
      return Memo.hash(memoContent);
    case MemoReturn:
      return Memo.return(memoContent);
    case MemoNone:
    default:
      return Memo.none();
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
      isAccountFunded,
    } = params;
    const { settings } = store.getState();
    const server = new Server(getNetworkConfig(settings.isTestnet).url);
    const sequence = (await server.loadAccount(publicKey)).sequence;
    const source = new Account(publicKey, sequence);
    let operation;

    if (isAccountFunded) {
      operation = Operation.payment({
        destination: toAccountId,
        asset: Asset.native(),
        amount: amount.toString(),
      });
    } else {
      operation = Operation.createAccount({
        destination: toAccountId,
        startingBalance: amount.toString(),
      });
    }

    transaction = new TransactionBuilder(source, {
      fee: fee.toString(),
      networkPassphrase: getNetworkConfig(settings.isTestnet).network,
      timebounds: await server.fetchTimebounds(100),
    }).addOperation(operation);

    if (memoType !== MemoNone) {
      transaction = transaction.addMemo(
        createMemo(memoType, memoContent as string),
      );
    }

    transaction = transaction.build();
  } catch (error) {
    throw new Error(
      `Failed to build transaction, error: ${getErrorString(error)})}`,
    );
  }
  return transaction;
};
