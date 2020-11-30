import StellarSdk, { MemoType } from "stellar-sdk";

export const getMemoTypeText = (memoType?: MemoType) => {
  let memoTypeText;

  switch (memoType) {
    case StellarSdk.MemoText:
      memoTypeText = "MEMO_TEXT";
      break;
    case StellarSdk.MemoHash:
      memoTypeText = "MEMO_HASH";
      break;
    case StellarSdk.MemoID:
      memoTypeText = "MEMO_ID";
      break;
    case StellarSdk.MemoReturn:
      memoTypeText = "MEMO_RETURN";
      break;
    default:
      memoTypeText = "";
      break;
  }

  return memoTypeText;
};
