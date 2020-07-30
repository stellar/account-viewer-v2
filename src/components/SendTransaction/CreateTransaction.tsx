import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StellarSdk, { MemoType, FederationServer } from "stellar-sdk";
import BigNumber from "bignumber.js";

import { ActionStatus, NetworkCongestion } from "constants/types.d";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { lumensFromStroops } from "helpers/stroopConversion";
import { useRedux } from "hooks/useRedux";
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

const isFederationAddress = (value: string) => value.includes("*");

interface CreateTransactionProps {
  formData: FormData;
  maxFee: string;
  onContinue: () => void;
  onInput: (formData: FormData) => void;
  setMaxFee: (maxFee: string) => void;
}

export const CreateTransaction = ({
  formData,
  maxFee,
  onContinue,
  onInput,
  setMaxFee,
}: CreateTransactionProps) => {
  const { settings } = useRedux(["settings"]);
  const [isMemoVisible, setIsMemoVisible] = useState(!!formData.memoContent);
  const [isMemoTypeFromFederation, setIsMemoTypeFromFederation] = useState(
    false,
  );
  const [
    isMemoContentFromFederation,
    setIsMemoContentFromFederation,
  ] = useState(false);
  const [
    federationAddressFetchStatus,
    setFederationAddressFetchStatus,
  ] = useState<string | null>(null);
  const [recommendedFee, setRecommendedFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );
  const [networkCongestion, setNetworkCongestion] = useState(
    NetworkCongestion.LOW,
  );

  useEffect(() => {
    const fetchNetworkBaseFee = async () => {
      const server = new StellarSdk.Server(
        getNetworkConfig(settings.isTestnet).url,
      );
      try {
        const feeStats = await server.feeStats();
        const networkFee = lumensFromStroops(
          feeStats.fee_charged.mode,
        ).toString();
        setRecommendedFee(networkFee);
        setMaxFee(networkFee);
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

    fetchNetworkBaseFee();
  }, [setMaxFee, settings.isTestnet]);

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

        if (response.memo || response.memo_type) {
          setIsMemoVisible(true);
          if (response.memo_type) {
            setIsMemoTypeFromFederation(true);
          }
          if (response.memo) {
            setIsMemoContentFromFederation(true);
          }

          onInput({
            ...formData,
            federationAddress: response.account_id,
            memoType: response.memo_type || StellarSdk.MemoText,
            memoContent: response.memo || "",
          });
        } else {
          onInput({
            ...formData,
            federationAddress: response.account_id,
          });
        }
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
            <El>Loading federation address…</El>
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
            Memo Type:
            <TempSelectInputEl
              onChange={(e) => {
                onInput({
                  ...formData,
                  memoType: e.target.value as MemoType,
                });
              }}
              value={formData.memoType}
              disabled={isMemoTypeFromFederation}
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
              disabled={isMemoContentFromFederation}
            ></TempInputEl>
            {(isMemoContentFromFederation || isMemoTypeFromFederation) && (
              <El>Memo information is provided by the federation address</El>
            )}
          </El>
          <El>
            {!isMemoContentFromFederation && (
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
            )}
          </El>
        </>
      )}
      <El>
        Fee (lumens) :{" "}
        <TempInputEl
          type="number"
          value={maxFee}
          onChange={(e) => {
            setMaxFee(e.target.value);
          }}
        ></TempInputEl>
      </El>
      <El>
        <b>{networkCongestion} congestion!</b> Recommended fee: {recommendedFee}
      </El>
      <button onClick={onContinue}>Continue</button>
    </El>
  );
};
