import React from "react";

import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";

export const AccountIsUnsafe = () => (
  <InfoBlock variant={InfoBlockVariant.warning}>
    <p>
      The account you’re sending to is tagged as <strong>#unsafe</strong> on{" "}
      <a
        href="https://stellar.expert/"
        target="_blank"
        rel="noopener noreferrer"
      >
        stellar.expert’s directory
      </a>
      . Proceed with caution.
    </p>
  </InfoBlock>
);
