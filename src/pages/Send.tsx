import React, { useState } from "react";
import StellarSdk from "stellar-sdk";
import styled from "styled-components";
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

export function Send() {
  const { sendTx } = useRedux(["sendTx"]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    toAccountId: "",
    amount: new BigNumber(0),
    fee: Number(StellarSdk.BASE_FEE) / 1e7,
  });

  // ALEC TODO - remove hard coding
  const secret = "SA6ST6NM5MMSPIT4LPI72VDWG5VN3OVMH4SCMUCTBV3OLJIUSFELSN7I";

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
        ></TempInputEl>
      </El>
      <El>
        Amount (lumens) :{" "}
        <TempInputEl
          type="number"
          onChange={(e) => {
            setFormData({ ...formData, amount: new BigNumber(e.target.value) });
          }}
        ></TempInputEl>
      </El>
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
            sendTransaction(
              // ALEC TODO - remove hardcoding
              // account.data?.secret,
              secret,
              formData.toAccountId,
              formData.amount,
              Math.round(formData.fee * 1e7),
            ),
          )
        }
      >
        Send
      </TempButtonEl>
      {sendTx.status === ActionStatus.PENDING && <El>Loading ...</El>}
      {sendTx.errorMessage && <El>sendTx.errorMessage</El>}
      {sendTx.data?.successful && <El>Success!</El>}
    </El>
  );
}
