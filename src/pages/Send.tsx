import React, { useState } from "react";
import StellarSdk from "stellar-sdk";
import styled from "styled-components";
// TODO - need to add to package.json? getting weird error when it upgrades
import BigNumber from "bignumber.js";

import { sendTransaction } from "ducks/send";
import { useDispatch } from "react-redux";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "ducks/account";

// TODO - move to modal

const El = styled.div``;

const TempButtonEl = styled.button`
  margin-bottom: 20px;
`;

const TempInputEl = styled.input`
  margin-bottom: 20px;
  min-width: 300px;
`;

const TempSelectInputEl = styled.select`
  margin-bottom: 20px;
  min-width: 300px;
`;

const TempAnchorEl = styled.a`
  display: block;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: underline;
`;

export function Send() {
  const { sendTx } = useRedux(["sendTx"]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    toAccountId: "",
    amount: new BigNumber(0),
    fee: Number(StellarSdk.BASE_FEE) / 1e7,
    memoType: StellarSdk.MemoNone,
    memoContent: "",
  });
  const [addMemo, setAddMemo] = useState(false);

  // ALEC TODO - remove hard coding
  const secret = "SAOMIQJ6XOKB7JQTPUGOLEICC2FEJBWLFNJV3DCDPDUL74MFVJWLJNH5";

  const memoPlaceholderMap: { [index: string]: string } = {
    [StellarSdk.MemoText]: "Up to 28 characters",
    [StellarSdk.MemoID]: "Unsigned 64-bit integer",
    [StellarSdk.MemoHash]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoReturn]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoNone]: "",
  };

  const createMemo = (memoType: any, memoContent: any) => {
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

  return (
    <El>
      <p>Send page</p>
      <El>
        Sending To:{" "}
        <TempInputEl
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, toAccountId: e.target.value })
          }
          placeholder="Recipient's public key or federation address"
        ></TempInputEl>
      </El>
      <El>
        Amount (lumens) :{" "}
        <TempInputEl
          type="number"
          onChange={(e) => {
            setFormData({
              ...formData,
              amount: new BigNumber(e.target.value || 0),
            });
          }}
          placeholder="0"
        ></TempInputEl>
      </El>
      <El>
        {!addMemo && (
          <TempAnchorEl
            onClick={() => {
              setFormData({ ...formData, memoType: StellarSdk.MemoText });
              setAddMemo(true);
            }}
          >
            Add memo
          </TempAnchorEl>
        )}
      </El>
      {addMemo && (
        <>
          <El>
            Memo Type:{" "}
            <TempSelectInputEl
              onChange={(e) => {
                setFormData({
                  ...formData,
                  memoType: e.target.value,
                });
              }}
            >
              <option value={StellarSdk.MemoText}>MEMO_TEXT</option>
              <option value={StellarSdk.MemoID}>MEMO_ID</option>
              <option value={StellarSdk.MemoHash}>MEMO_HASH</option>
              <option value={StellarSdk.MemoReturn}>MEMO_RETURN</option>
            </TempSelectInputEl>
          </El>
          <El>
            Memo Content:{" "}
            <TempInputEl
              type="text"
              placeholder={memoPlaceholderMap[formData.memoType]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  memoContent: e.target.value,
                });
              }}
            ></TempInputEl>
          </El>
          <El>
            <TempAnchorEl
              onClick={() => {
                setFormData({
                  ...formData,
                  memoType: StellarSdk.MemoNone,
                  memoContent: "",
                });
                setAddMemo(false);
              }}
            >
              Remove memo:
            </TempAnchorEl>
          </El>
        </>
      )}
      <El>
        Fee (lumens) :{" "}
        <TempInputEl
          type="number"
          value={formData.fee}
          onChange={(e) => {
            setFormData({ ...formData, fee: Number(e.target.value) });
          }}
        ></TempInputEl>
      </El>
      <TempButtonEl
        onClick={() =>
          dispatch(
            sendTransaction({
              // ALEC TODO - remove hardcoding
              // account.data?.secret,
              secret,
              toAccountId: formData.toAccountId,
              amount: formData.amount,
              fee: Math.round(formData.fee * 1e7),
              memo: createMemo(formData.memoType, formData.memoContent),
            }),
          )
        }
      >
        Send
      </TempButtonEl>
      {sendTx.status === ActionStatus.PENDING && <El>Loading ...</El>}
      {sendTx.errorMessage && <El>{sendTx.errorMessage}</El>}
      {sendTx.data?.successful && <El>Success!</El>}
    </El>
  );
}
