/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/newline-after-description */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-unresolved
import StellarSdk from "stellar-sdk";
import BigNumber from "bignumber.js";

/**
 * Transforms StellarSdk.Signer to TrezorConnect.StellarTransaction.Signer
 * @param {StellarSdk.Signer} signer
 * @returns { type: 1 | 2 | 3, key: string, weight: number }
 */
const transformSigner = (signer: {
  ed25519PublicKey?: any;
  preAuthTx?: any;
  sha256Hash?: any;
  weight?: any;
}) => {
  let type = 0;
  let key;
  const { weight } = signer;
  if (typeof signer.ed25519PublicKey === "string") {
    const keyPair = StellarSdk.Keypair.fromPublicKey(signer.ed25519PublicKey);
    key = keyPair.rawPublicKey().toString("hex");
  }
  if (signer.preAuthTx instanceof Buffer) {
    type = 1;
    key = signer.preAuthTx.toString("hex");
  }
  if (signer.sha256Hash instanceof Buffer) {
    type = 2;
    key = signer.sha256Hash.toString("hex");
  }
  return {
    type,
    key,
    weight,
  };
};

/**
 * Transforms StellarSdk.Asset to TrezorConnect.StellarTransaction.Asset
 * @param {StellarSdk.Asset} asset
 * @returns { type: 0 | 1 | 2, code: string, issuer?: string }
 */
const transformAsset = (asset: {
  isNative: () => any;
  getCode: () => any;
  getAssetType: () => string;
  getIssuer: () => any;
}) => {
  if (asset.isNative()) {
    return {
      type: 0,
      code: asset.getCode(),
    };
  }
  return {
    type: asset.getAssetType() === "credit_alphanum4" ? 1 : 2,
    code: asset.getCode(),
    issuer: asset.getIssuer(),
  };
};

/**
 * Transforms amount from decimals (lumens) to integer (stroop)
 * @param {string} amount
 * @returns {string}
 */
const transformAmount = (amount: BigNumber.Value) =>
  new BigNumber(amount).times(10000000).toString();

/**
 * Transforms StellarSdk.Memo to TrezorConnect.StellarTransaction.Memo
 * @param {string} type
 * @returns {string}
 */
const transformMemo = (memo: {
  type: any;
  value: { toString: (arg0: string) => any };
}) => {
  switch (memo.type) {
    case StellarSdk.MemoText:
      return { type: 1, text: memo.value.toString("utf-8") };
    case StellarSdk.MemoID:
      return { type: 2, id: memo.value };
    case StellarSdk.MemoHash:
      // stringify is not necessary, Buffer is also accepted
      return { type: 3, hash: memo.value.toString("hex") };
    case StellarSdk.MemoReturn:
      // stringify is not necessary, Buffer is also accepted
      return { type: 4, hash: memo.value.toString("hex") };
    default:
      return { type: 0 };
  }
};

/**
 * Transforms StellarSdk.Transaction.timeBounds to TrezorConnect.StellarTransaction.timebounds
 * @param {string} path
 * @param {StellarSdk.Transaction.timeBounds} timebounds
 * @returns {minTime: number, maxTime: number}
 */
const transformTimebounds = (timebounds: {
  minTime: string;
  maxTime: string;
}) => {
  if (!timebounds) return undefined;
  // those values are defined in Trezor firmware messages as numbers
  return {
    minTime: Number.parseInt(timebounds.minTime, 10),
    maxTime: Number.parseInt(timebounds.maxTime, 10),
  };
};

/**
 * Transforms StellarSdk.Transaction to TrezorConnect.StellarTransaction
 * @param {string} path
 * @param {StellarSdk.Transaction} transaction
 * @returns {TrezorConnect.StellarTransaction}
 */
const transformTransaction = (path: string, transaction: any) => {
  const amounts = [
    "amount",
    "sendMax",
    "destAmount",
    "startingBalance",
    "limit",
    "buyAmount",
  ];
  const assets = [
    "asset",
    "sendAsset",
    "destAsset",
    "selling",
    "buying",
    "line",
  ];

  const operations = transaction.operations.map((o: any, i: number) => {
    const operation: any = { ...o };

    // transform StellarSdk.Signer
    if (operation.signer) {
      operation.signer = transformSigner(operation.signer);
    }

    // transform asset path
    if (operation.path) {
      operation.path = operation.path.map(transformAsset);
    }

    // transform "price" field to { n: number, d: number }
    if (typeof operation.price === "string") {
      const xdrOperation = transaction.tx.operations()[i];
      operation.price = {
        n: xdrOperation.body().value().price().n(),
        d: xdrOperation.body().value().price().d(),
      };
    }

    // transform amounts
    amounts.forEach((field) => {
      if (typeof operation[field] === "string") {
        operation[field] = transformAmount(operation[field]);
      }
    });

    // transform assets
    assets.forEach((field) => {
      if (operation[field]) {
        operation[field] = transformAsset(operation[field]);
      }
    });

    // add missing field
    if (operation.type === "allowTrust") {
      const allowTrustAsset = new StellarSdk.Asset(
        operation.assetCode,
        operation.trustor,
      );
      operation.assetType = transformAsset(allowTrustAsset).type;
    }

    if (operation.type === "manageData" && operation.value) {
      // stringify is not necessary, Buffer is also accepted
      operation.value = operation.value.toString("hex");
    }
    if (operation.type === "manageBuyOffer") {
      operation.amount = operation.buyAmount;
      delete operation.buyAmount;
    }
    operation.type = o.type;

    return operation;
  });

  return {
    path,
    networkPassphrase: transaction.networkPassphrase,
    transaction: {
      source: transaction.source,
      fee: Number.parseInt(transaction.fee, 10),
      sequence: transaction.sequence,
      memo: transformMemo(transaction.memo),
      timebounds: transformTimebounds(transaction.timeBounds),
      operations,
    },
  };
};

export default transformTransaction;
