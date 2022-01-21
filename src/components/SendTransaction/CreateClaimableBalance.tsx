import React, { useState, useEffect } from "react";
import { DataProvider } from "@stellar/wallet-sdk";
import StellarSdk, {
  FederationServer,
  StrKey,
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
  ActionStatus,
  NetworkCongestion,
  PaymentFormData,
} from "types/types.d";

import { buildPaymentTransaction } from "helpers/BuildClaimClaimableBalanceTransaction";
import { lumensFromStroops, stroopsFromLumens } from "helpers/stroopConversion";

const isFederationAddress = (value: string) => value.includes("*");

enum SendFormIds {
  CLAIMABLE_BALANCE_ID = "claimable_balance_id",
  SEND_FEE = "send-fee",
}

type ValidatedInput = {
  [inputId: string]: string;
};

interface CreateClaimableBalanceProps {
  initialFormData: PaymentFormData;
  balanceId: string;
  maxFee: string;
  onContinue: (formData: PaymentFormData) => void;
  onCancel: () => void;
  setMaxFee: (maxFee: string) => void;
}

export const CreateClaimableBalance = ({
  maxFee,
  balanceId,
  initialFormData,
  onContinue,
  onCancel,
  setMaxFee,
}: CreateClaimableBalanceProps) => {
  const { account, memoRequiredAccounts, settings } = useRedux(
    "account",
    "memoRequiredAccounts",
    "settings",
  );
  const knownMemoAccounts = memoRequiredAccounts.data;

  const initialInputErrors = {
    [SendFormIds.SEND_FEE]: "",
  };

  const memoPlaceholderMap: { [index: string]: string } = {
    [StellarSdk.MemoText]: "Up to 28 characters",
    [StellarSdk.MemoID]: "Unsigned 64-bit integer",
    [StellarSdk.MemoHash]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoReturn]:
      "32-byte hash in hexadecimal format (64 [0-9a-f] characters)",
    [StellarSdk.MemoNone]: "",
  };

  // Form values
  const [toAccountId, setToAccountId] = useState(initialFormData.toAccountId);
  const [federationAddress, setFederationAddress] = useState(
    initialFormData.federationAddress,
  );
  const [amount, setAmount] = useState(initialFormData.amount);
  const [memoType, setMemoType] = useState(initialFormData.memoType);
  const [memoContent, setMemoContent] = useState(
    initialFormData.memoContent as string,
  );
  const [isAccountFunded, setIsAccountFunded] = useState(
    initialFormData.isAccountFunded,
  );

  const [isAccountUnsafe, setIsAccountUnsafe] = useState(
    initialFormData.isAccountUnsafe,
  );
  const [isAccountMalicious, setIsAccountMalicious] = useState(false);

  const knownAccount =
    knownMemoAccounts[toAccountId] ||
    knownMemoAccounts[federationAddress || ""];
  const [prevAddress, setPrevAddress] = useState(
    toAccountId || federationAddress || "",
  );
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [isAccountIdTouched, setIsAccountIdTouched] = useState(false);

  const [isMemoVisible, setIsMemoVisible] = useState(!!memoContent);
  const [isMemoTypeFromFederation, setIsMemoTypeFromFederation] =
    useState(false);
  const [isMemoContentFromFederation, setIsMemoContentFromFederation] =
    useState(false);
  const [federationAddressFetchStatus, setFederationAddressFetchStatus] =
    useState<string | null>(null);
  const [recommendedFee, setRecommendedFee] = useState(
    lumensFromStroops(StellarSdk.BASE_FEE).toString(),
  );
  const [federationAddressError, setFederationAddressError] = useState("");
  const [networkCongestion, setNetworkCongestion] = useState(
    NetworkCongestion.LOW,
  );
  const [inputErrors, setInputErrors] =
    useState<ValidatedInput>(initialInputErrors);
  const [txInProgress, setTxInProgress] = useState(false);

  const availableBalance = account.data
    ? new BigNumber(account.data.balances.native.total)
    : "0";

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

  useEffect(() => {
    setIsMemoVisible(Boolean(memoContent || knownAccount));
  }, [knownAccount, memoContent]);

  const fetchIfFederationAddress = async () => {
    setFederationAddressError("");

    if (isFederationAddress(toAccountId)) {
      setFederationAddressFetchStatus(ActionStatus.PENDING);

      try {
        const response = await FederationServer.resolve(toAccountId);

        setFederationAddressFetchStatus(ActionStatus.SUCCESS);
        setFederationAddress(response.account_id);
        checkAndSetIsAccountFunded(response.account_id);

        if (!StrKey.isValidEd25519PublicKey(response.account_id)) {
          setFederationAddressError(
            "Stellar address or public key resolved from federation address is invalid",
          );
        }

        if (response.memo || response.memo_type) {
          setIsMemoVisible(true);
          setMemoType(response.memo_type || StellarSdk.MemoText);
          setMemoContent(response.memo || "");
          setIsMemoTypeFromFederation(Boolean(response.memo_type));
          setIsMemoContentFromFederation(Boolean(response.memo));
        } else if (knownMemoAccounts[response.account_id]) {
          setIsMemoVisible(true);
          setMemoType(StellarSdk.MemoText);
          setMemoContent(response.memo || "");
        }
      } catch (err) {
        setFederationAddressError("Federation Address not found");
        setFederationAddressFetchStatus(null);
      }
    } else {
      resetFederationAddressInput();
    }
  };

  const { flaggedAccounts } = useRedux("flaggedAccounts");

  const checkIfAccountIsFlagged = (accountId: string) => {
    const flaggedTags = flaggedAccounts.data.reduce(
      (prev: string[], { address, tags }) =>
        address === accountId ? [...prev, ...tags] : prev,
      [],
    );
    setIsAccountUnsafe(flaggedTags.includes("unsafe"));
    setIsAccountMalicious(flaggedTags.includes("malicious"));
  };

  const resetAccountIsFlagged = () => {
    setIsAccountUnsafe(false);
    setIsAccountMalicious(false);
  };

  const checkAndSetIsAccountFunded = async (accountId: string) => {
    if (!accountId || !StrKey.isValidEd25519PublicKey(accountId)) {
      setIsAccountFunded(true);
      return;
    }

    setIsCheckingAddress(true);

    const dataProvider = new DataProvider({
      serverUrl: getNetworkConfig(settings.isTestnet).url,
      accountOrKey: accountId,
      networkPassphrase: getNetworkConfig(settings.isTestnet).network,
    });

    setIsAccountFunded(await dataProvider.isAccountFunded());
    setIsCheckingAddress(false);
  };

  const resetFederationAddressInput = () => {
    setFederationAddressFetchStatus(null);
    setFederationAddress(undefined);
  };

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
    const tx2 = await buildPaymentTransaction({
      publicKey: account.data.id,
      balanceId: balanceId.toString(),
      fee: stroopsFromLumens(maxFee).toNumber(),
    });
    if (federationAddressError) {
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
        balanceId: balanceId.toString(),
        fee: stroopsFromLumens(maxFee).toNumber(),
      });
      
      setTxInProgress(false);

      onContinue({
        toAccountId,
        federationAddress,
        amount,
        memoType,
        memoContent,
        isAccountFunded,
        isAccountUnsafe,
        tx,
      });
    } catch (e) {
      setTxInProgress(false);
    }    
  };

  return (
    <>
      <Modal.Heading>CLaim Claimable Balance</Modal.Heading>

      <Modal.Body>
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
            disabled={
              isCheckingAddress ||
              federationAddressFetchStatus === ActionStatus.PENDING
            }
          />
        </LayoutRow>
      </Modal.Body>

      <Modal.Footer>
        <Button
          disabled={isAccountMalicious}
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
