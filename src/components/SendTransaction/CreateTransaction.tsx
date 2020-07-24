import React, { useState, useEffect } from "react";
import StellarSdk, { MemoType, FederationServer } from "stellar-sdk";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { ActionStatus } from "ducks/account";
import { lumensFromStroops } from "helpers/stroopConversion";
import { FormData } from "./SendTransactionFlow";

const El = styled.div`
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

interface CreateProps {
  onContinue: () => void;
  onInput: (formData: FormData) => void;
  formData: FormData;
}

const isFederationAddress = (value: string) => value.includes("*");

// TODO - move to constants folder
const NetworkCongestion = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

export const CreateTransaction = (props: CreateProps) => {
  const { formData, onInput } = props;
  const [isMemoVisible, setIsMemoVisible] = useState(!!formData.memoContent);
  const [
    federationAddressFetchStatus,
    setFederationAddressFetchStatus,
  ] = useState<string | null>(null);
  const [recomendedFee, setRecommendedFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );
  const [networkCongestion, setNetworkCongestion] = useState(
    NetworkCongestion.LOW,
  );

  const fetchNetworkBaseFee = async () => {
    // TODO - network config
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    try {
      const feeStats = await server.feeStats();
      setRecommendedFee(
        lumensFromStroops(feeStats.fee_charged.mode).toString(),
      );
      onInput({
        ...formData,
        fee: lumensFromStroops(feeStats.fee_charged.mode).toString(),
      });
      if (
        feeStats.ledger_capacity_usage > 0.5 &&
        feeStats.ledger_capacity_usage <= 0.75
      ) {
        setNetworkCongestion(NetworkCongestion.MEDIUM);
      } else if (feeStats.ledger_capacity_usage > 0.75) {
        setNetworkCongestion(NetworkCongestion.HIGH);
      }
    } catch (err) {
      // use default values
      
    }
  };

  useEffect(() => {
    fetchNetworkBaseFee();
    // eslint-disable-next-line
  }, []);

  const memoPlaceholderMap: { [index: string]: string } = {
    [StellarSdk.MemoText]: "Up to 28 characters",
    [StellarSdk.MemoID]: "Unsigned 64-bit integer",
    [StellarSdk.MemoHash]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoReturn]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoNone]: "",
  };

  const fetchIfFederationAddress = async () => {
    const { toAccountId } = formData;
    if (isFederationAddress(toAccountId)) {
      setFederationAddressFetchStatus(ActionStatus.PENDING);
      try {
        const response = await FederationServer.resolve(toAccountId);
        setFederationAddressFetchStatus(ActionStatus.SUCCESS);
        onInput({
          ...formData,
          federationAddress: response.account_id,
        });
      } catch (err) {
        setFederationAddressFetchStatus(ActionStatus.ERROR);
      }
    } else {
      resetFederationAddressInput();
    }
  };

  const resetFederationAddressInput = () => {
    setFederationAddressFetchStatus(null);
    onInput({ ...formData, federationAddress: undefined });
  };

  return (
    <El>
      <h1>Send Lumens</h1>
      <El>
        Sending To:{" "}
        <TempInputEl
          type="text"
          onChange={(e) =>
            onInput({ ...formData, toAccountId: e.target.value })
          }
          onBlur={fetchIfFederationAddress}
          value={formData.toAccountId}
          placeholder="Recipient's public key or federation address"
        ></TempInputEl>
      </El>
      {federationAddressFetchStatus && (
        <El>
          {federationAddressFetchStatus === ActionStatus.PENDING && (
            <El>Loading federation address...</El>
          )}
          {federationAddressFetchStatus === ActionStatus.SUCCESS && (
            <>
              <El>Federation Address: {formData.toAccountId}</El>
              <El>Resolves to: {formData.federationAddress}</El>
            </>
          )}
          {federationAddressFetchStatus === ActionStatus.ERROR && (
            <El>Federation Address not found</El>
          )}
        </El>
      )}
      <El>
        Amount (lumens) :{" "}
        <TempInputEl
          type="number"
          onChange={(e) => {
            onInput({
              ...formData,
              amount: new BigNumber(e.target.value || 0),
            });
          }}
          value={formData.amount.toString()}
          placeholder="0"
        ></TempInputEl>
      </El>
      <El>
        {!isMemoVisible && (
          <TempAnchorEl
            onClick={() => {
              onInput({ ...formData, memoType: StellarSdk.MemoText });
              setIsMemoVisible(true);
            }}
          >
            Add memo
          </TempAnchorEl>
        )}
      </El>
      {isMemoVisible && (
        <>
          <El>
            Memo Type:{" "}
            <TempSelectInputEl
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoType: e.target.value as MemoType,
                });
              }}
              value={formData.memoType}
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
              placeholder={
                memoPlaceholderMap[formData.memoType || StellarSdk.MemoNone]
              }
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoContent: e.target.value,
                });
              }}
              value={formData.memoContent as string}
            ></TempInputEl>
          </El>
          <El>
            <TempAnchorEl
              onClick={() => {
                onInput({
                  ...formData,
                  memoType: StellarSdk.MemoNone,
                  memoContent: "",
                });
                setIsMemoVisible(false);
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
            onInput({ ...formData, fee: e.target.value });
          }}
        ></TempInputEl>
      </El>
      <El>
        <b>{networkCongestion} congestion!</b> Recommended fee: {recomendedFee}
      </El>
      <button onClick={props.onContinue}>Continue</button>
    </El>
  );
};
