import { MemoHash, MemoID, MemoReturn, MemoText, MemoType } from "stellar-sdk";

export const getMemoTypeText = (memoType?: MemoType) => {
  let memoTypeText;

  switch (memoType) {
    case MemoText:
      memoTypeText = "MEMO_TEXT";
      break;
    case MemoHash:
      memoTypeText = "MEMO_HASH";
      break;
    case MemoID:
      memoTypeText = "MEMO_ID";
      break;
    case MemoReturn:
      memoTypeText = "MEMO_RETURN";
      break;
    default:
      memoTypeText = "";
      break;
  }

  return memoTypeText;
};
