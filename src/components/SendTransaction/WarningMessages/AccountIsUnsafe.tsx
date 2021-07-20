import { InfoBlock, TextLink } from "@stellar/design-system";

export const AccountIsUnsafe = () => (
  <InfoBlock variant={InfoBlock.variant.warning}>
    <p>
      The account you’re sending to is tagged as <code>#unsafe</code> on{" "}
      <TextLink href="https://stellar.expert/directory">
        stellar.expert’s directory
      </TextLink>
      . Proceed with caution.
    </p>
  </InfoBlock>
);
