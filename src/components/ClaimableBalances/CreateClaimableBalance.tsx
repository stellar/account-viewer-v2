import React, { useState, useEffect } from "react";
import StellarSdk, {
  Asset,
} from "stellar-sdk";
import { BigNumber } from "bignumber.js";
import {
  Button,
  Input,
  Modal,
} from "@stellar/design-system";
import { LayoutRow } from "components/LayoutRow";
import { getNetworkConfig } from "helpers/getNetworkConfig";
import { logEvent } from "helpers/tracking";
import { useRedux } from "hooks/useRedux";
import {
  NetworkCongestion,
  ClaimBalanceData,
} from "types/types.d";
import { LabelAndValue } from "components/LabelAndValue";
import { buildPaymentTransaction } from "components/ClaimableBalances/BuildClaimClaimableBalanceTransaction";
import { lumensFromStroops, stroopsFromLumens } from "helpers/stroopConversion";

enum SendFormIds {
  CLAIMABLE_BALANCE_ID = "claimable_balance_id",
  SEND_FEE = "send-fee",
}

type ValidatedInput = {
  [inputId: string]: string;
};

interface CreateClaimableBalanceProps {
  balanceId: string;
  balanceAsset: Asset;
  maxFee: string;
  onContinue: (formData: ClaimBalanceData) => void;
  onCancel: () => void;
  setMaxFee: (maxFee: string) => void;
}

export const CreateClaimableBalance = ({
  maxFee,
  balanceId,
  balanceAsset,
  onContinue,
  onCancel,
  setMaxFee,
}: CreateClaimableBalanceProps) => {
  const { account, settings } = useRedux(
    "account",
    "settings",
  );

  const initialInputErrors = {
    [SendFormIds.SEND_FEE]: "",
  };

  const [recommendedFee, setRecommendedFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );
  const [networkCongestion, setNetworkCongestion] = useState(
    NetworkCongestion.LOW,
  );
  const [inputErrors, setInputErrors] =
    useState<ValidatedInput>(initialInputErrors);
  const [txInProgress, setTxInProgress] = useState(false);

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

  const validateInput = (inputId: string) => {
    const errors: ValidatedInput = {};
    let message = "";

    switch (inputId) {
      case SendFormIds.SEND_FEE:
        // recommendedFee is minimum fee
        if (!maxFee) {
          message = "Please enter fee";
        } else if (new BigNumber(maxFee).lt(recommendedFee)) {
          message = `Fee is too small. Minimum fee is ${recommendedFee}.`;
        }

        errors[SendFormIds.SEND_FEE] = message;
        if (message) {
          logEvent("send: saw fee too small error");
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const validate = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputErrors({ ...inputErrors, ...validateInput(event.target.id) });
  };

  const clearInputError = (inputId: string) => {
    if (!inputErrors[inputId]) {
      return;
    }

    setInputErrors({ ...inputErrors, [inputId]: "" });
  };

  const onSubmit = async () => {
    let errors = {};
    let hasErrors = false;

    if (!account.data?.id) {
      setInputErrors({
        ...inputErrors,
      });
      return;
    }

    // Loop through inputs we need to validate
    Object.keys(inputErrors).forEach((inputId) => {
      errors = { ...errors, ...validateInput(inputId) };

      // Check if input has error message
      if (!hasErrors && validateInput(inputId)[inputId]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setInputErrors(errors);
    }

    try {
      setTxInProgress(true);

      const tx = await buildPaymentTransaction({
        publicKey: account.data.id,
        balanceId,
        balanceAsset,
        fee: stroopsFromLumens(maxFee).toNumber(),
      });

      setTxInProgress(false);

      onContinue({
        balanceAsset,
        balanceId,
        tx,
      });
    } catch (e) {
      setTxInProgress(false);
    }
  };

  const renderAssetIssuerLabel = () => {
    if (!balanceAsset.isNative()) {
      return (
        <LabelAndValue label="Asset Issuer">
          {balanceAsset.issuer}
        </LabelAndValue>);
    } return null;
  };

  return (
    <>
      <Modal.Heading>CLaim Claimable Balance</Modal.Heading>

      <Modal.Body>
        <LabelAndValue label="Claimable Balance ID">
          {balanceId}
        </LabelAndValue>

        <LabelAndValue label="Asset Code">
          {balanceAsset.code}
        </LabelAndValue>

        {renderAssetIssuerLabel()}

        <LayoutRow>
          <Input
            id={SendFormIds.SEND_FEE}
            label="Fee"
            rightElement="lumens"
            type="number"
            value={maxFee}
            onChange={(e) => {
              clearInputError(e.target.id);
              setMaxFee(e.target.value);
            }}
            onBlur={validate}
            error={inputErrors[SendFormIds.SEND_FEE]}
            note={
              <>
                <span className={`Congestion Congestion--${networkCongestion}`}>
                  {networkCongestion.toUpperCase()} congestion!
                </span>
                <br />
                Recommended fee: {recommendedFee}.
              </>
            }
          />
        </LayoutRow>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={onSubmit}
          isLoading={txInProgress}
        >
          Continue
        </Button>
        <Button
          disabled={txInProgress}
          onClick={onCancel}
          variant={Button.variant.secondary}
        >
          Cancel
        </Button>
      </Modal.Footer>

      {txInProgress && (
        <p className="Paragraph--secondary align--right">
          Validating transaction
        </p>
      )}
    </>
  );
};
