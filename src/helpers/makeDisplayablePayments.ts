// Used from js-stellar-wallets
import { AssetType, Horizon } from "@stellar/stellar-sdk";
import BigNumber from "bignumber.js";
import {
  Account,
  AssetToken,
  NativeToken,
  Payment,
  PaymentOperation,
  Token,
} from "types/types";

function isCreateAccount(
  obj: any,
): obj is Horizon.ServerApi.CreateAccountOperationRecord {
  return obj.type === "create_account";
}

function isAccountMerge(
  obj: any,
): obj is Horizon.ServerApi.AccountMergeOperationRecord {
  return obj.type === "account_merge";
}

function isPathPayment(
  obj: any,
): obj is Horizon.ServerApi.PathPaymentOperationRecord {
  return (
    // old, soon-to-be-deprecated name
    obj.type === "path_payment" ||
    // new names
    obj.type === "path_payment_strict_send" ||
    obj.type === "path_payment_strict_receive"
  );
}

async function getAccountMergePaymentAmount(
  payment: Horizon.ServerApi.AccountMergeOperationRecord,
  publicKey: string,
): Promise<string | undefined> {
  try {
    const effects = await payment.effects();
    const accountMergePayment: any = effects.records.find(
      (record) =>
        record.type === "account_credited" && record.account === publicKey,
    );

    if (accountMergePayment) {
      return accountMergePayment.amount;
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
}

function getMergedAccount(
  payment: Horizon.ServerApi.AccountMergeOperationRecord,
) {
  return {
    publicKey: payment.source_account,
  };
}

export function makeDisplayablePayments(
  subjectAccountAddress: string,
  payments: PaymentOperation[],
): Promise<Payment[]> {
  return Promise.all(
    payments
      .filter((p) =>
        [
          "create_account",
          "account_merge",
          "payment",
          "path_payment_strict_send",
          "path_payment_strict_receive",
          "path_payment",
        ].includes(p.type),
      )
      .map(async (payment: PaymentOperation): Promise<Payment> => {
        const isRecipient = payment.source_account !== subjectAccountAddress;

        let otherAccount: Account;

        if (isCreateAccount(payment)) {
          otherAccount = {
            publicKey: payment.funder,
          };
        } else {
          otherAccount = { publicKey: isRecipient ? payment.from : payment.to };
        }

        const token: Token = isCreateAccount(payment)
          ? ({
              type: "native" as AssetType,
              code: "XLM",
            } as NativeToken)
          : ({
              type: payment.asset_type,
              code: payment.asset_code || "XLM",
              issuer:
                payment.asset_type === "native"
                  ? undefined
                  : {
                      key: payment.asset_issuer as string,
                    },
            } as AssetToken);

        // "account_merge" record does not have "amount" property
        let accountMergePaymentAmount;
        let mergedAccount;

        if (isAccountMerge(payment)) {
          accountMergePaymentAmount = await getAccountMergePaymentAmount(
            payment,
            subjectAccountAddress,
          );
          mergedAccount = getMergedAccount(payment);
        }

        let transaction: any | undefined;
        try {
          transaction = await payment.transaction();
        } catch (e) {
          // do nothing
        }

        return {
          id: payment.id,
          isInitialFunding: isCreateAccount(payment),
          isRecipient,
          token,
          amount: new BigNumber(
            isCreateAccount(payment)
              ? payment.starting_balance
              : accountMergePaymentAmount || payment.amount,
          ),
          timestamp: Math.floor(new Date(payment.created_at).getTime() / 1000),
          otherAccount,
          sourceToken: isPathPayment(payment)
            ? ({
                type: payment.source_asset_type,
                code: payment.source_asset_code || "XLM",
                issuer:
                  payment.source_asset_type === "native"
                    ? undefined
                    : {
                        key: payment.source_asset_issuer as string,
                      },
              } as Token)
            : undefined,
          sourceAmount: isPathPayment(payment)
            ? new BigNumber(payment.source_amount)
            : undefined,
          transactionId: payment.transaction_hash,
          type: payment.type,
          ...(transaction
            ? {
                memo: transaction.memo,
                memoType: transaction.memo_type,
              }
            : {}),
          mergedAccount,
        };
      }),
  );
}
