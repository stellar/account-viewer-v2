import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StellarSdk, { MemoType, FederationServer } from "stellar-sdk";
import BigNumber from "bignumber.js";

import { Button, ButtonVariant } from "components/basic/Button";
import { TextButton, TextButtonVariant } from "components/basic/TextButton";
import { Input } from "components/basic/Input";
import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";
import { Select } from "components/basic/Select";
import { ModalContent } from "components/ModalContent";

import { getNetworkConfig } from "helpers/getNetworkConfig";
import { lumensFromStroops } from "helpers/stroopConversion";
import { useRedux } from "hooks/useRedux";
import { ActionStatus, NetworkCongestion } from "types/types.d";
import { FormData } from "./SendTransactionFlow";

const RowEl = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`;

const CellEl = styled.div`
  width: 100%;

  @media (min-width: 600px) {
    width: calc(50% - 0.75rem);
  }
`;

const isFederationAddress = (value: string) => value.includes("*");

interface CreateTransactionProps {
  formData: FormData;
  maxFee: string;
  onContinue: () => void;
  onInput: (formData: FormData) => void;
  onCancel: () => void;
  setMaxFee: (maxFee: string) => void;
}

export const CreateTransaction = ({
  formData,
  maxFee,
  onContinue,
  onInput,
  onCancel,
  setMaxFee,
}: CreateTransactionProps) => {
  const { settings } = useRedux("settings");
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
    <ModalContent
      headlineText="Send Lumens"
      buttonFooter={
        <>
          <Button onClick={onContinue}>Continue</Button>
          <Button onClick={onCancel} variant={ButtonVariant.secondary}>
            Cancel
          </Button>
        </>
      }
    >
      <RowEl>
        <Input
          id="send-to"
          label="Sending To"
          type="text"
          onChange={(e) => {
            if (federationAddressFetchStatus) {
              setFederationAddressFetchStatus(null);
            }

            onInput({ ...formData, toAccountId: e.target.value });
          }}
          onBlur={fetchIfFederationAddress}
          value={formData.toAccountId}
          placeholder="Recipient's public key or federation address"
        />
      </RowEl>

      <RowEl>
        {federationAddressFetchStatus && (
          <InfoBlock
            variant={
              federationAddressFetchStatus === ActionStatus.ERROR
                ? InfoBlockVariant.warning
                : InfoBlockVariant.info
            }
          >
            {federationAddressFetchStatus === ActionStatus.PENDING && (
              <p>Loading federation address…</p>
            )}

            {federationAddressFetchStatus === ActionStatus.SUCCESS && (
              <>
                <p>
                  Federation Address: {formData.toAccountId}
                  <br />
                  Resolves to: {formData.federationAddress}
                </p>
              </>
            )}

            {federationAddressFetchStatus === ActionStatus.ERROR && (
              <p>Federation Address not found</p>
            )}
          </InfoBlock>
        )}
      </RowEl>

      <RowEl>
        <CellEl>
          <Input
            id="send-amount"
            label="Amount"
            rightElement="lumens"
            type="number"
            onChange={(e) => {
              onInput({
                ...formData,
                amount: new BigNumber(e.target.value || 0),
              });
            }}
            value={formData.amount.toString()}
            placeholder="0"
          />
        </CellEl>
      </RowEl>

      {!isMemoVisible && (
        <RowEl>
          <TextButton
            variant={TextButtonVariant.secondary}
            onClick={() => {
              onInput({ ...formData, memoType: StellarSdk.MemoText });
              setIsMemoVisible(true);
            }}
          >
            Add memo
          </TextButton>
        </RowEl>
      )}

      {isMemoVisible && (
        <>
          <RowEl>
            <CellEl>
              <Select
                id="send-memo-type"
                label="Memo Type"
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
              </Select>
            </CellEl>

            <CellEl>
              <Input
                id="send-memo-conent"
                label="Memo content"
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
              />
            </CellEl>
          </RowEl>

          {(isMemoContentFromFederation || isMemoTypeFromFederation) && (
            <RowEl>
              <InfoBlock>
                Memo information is provided by the federation address
              </InfoBlock>
            </RowEl>
          )}

          {!isMemoContentFromFederation && (
            <RowEl>
              <TextButton
                variant={TextButtonVariant.secondary}
                onClick={() => {
                  onInput({
                    ...formData,
                    memoType: StellarSdk.MemoNone,
                    memoContent: "",
                  });
                  setIsMemoVisible(false);
                }}
              >
                Remove memo
              </TextButton>
            </RowEl>
          )}
        </>
      )}

      <RowEl>
        <CellEl>
          <Input
            id="send-fee"
            label="Fee"
            rightElement="lumens"
            type="number"
            value={maxFee}
            onChange={(e) => {
              setMaxFee(e.target.value);
            }}
            note={
              <>
                <strong>{networkCongestion} congestion!</strong> Recommended
                fee: {recommendedFee}.
              </>
            }
          />
        </CellEl>
      </RowEl>
    </ModalContent>
  );
};
