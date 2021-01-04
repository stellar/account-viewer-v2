import React from "react";

import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";

export const AccountFlagged = ({ flagType = "" }) => (
  <InfoBlock variant={InfoBlockVariant.error}>
    <p>
      This destination account has been flagged as being potentially {flagType}.
    </p>
  </InfoBlock>
);
