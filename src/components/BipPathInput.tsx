import { Checkbox, Input } from "@stellar/design-system";
import { useState } from "react";
import { styled } from "styled-components";
import { defaultStellarBipPath } from "constants/settings";

const AccountWrapperEl = styled.div`
  margin-top: 1.5rem;

  & > div:nth-child(2) {
    margin-top: 1.5rem;
  }
`;

type BipPathInputProps = {
  id: string;
  value?: string;
  onValueChange: (val: string) => void;
};

export const BipPathInput = ({
  id,
  value = defaultStellarBipPath,
  onValueChange,
}: BipPathInputProps) => {
  const [isUsingDefault, setIsUsingDefault] = useState(true);

  const handleDefaultToggle = () => {
    setIsUsingDefault(!isUsingDefault);
    onValueChange(defaultStellarBipPath);
  };

  return (
    <AccountWrapperEl>
      <Checkbox
        id={`${id}-default-account`}
        label="Use default account"
        checked={isUsingDefault}
        onChange={handleDefaultToggle}
      />

      {!isUsingDefault && (
        <Input
          id={`${id}-account`}
          label="Enter BIP path"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
      )}
    </AccountWrapperEl>
  );
};
