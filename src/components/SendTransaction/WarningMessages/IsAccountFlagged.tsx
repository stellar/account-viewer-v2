import React from "react";

import { InfoBlock, InfoBlockVariant } from "components/basic/InfoBlock";

export const IsAccountFlagged = ({ flagType = "" }) => (
  <InfoBlock variant={InfoBlockVariant.error}>
    <p>This account has been flagged as being potentially {flagType}.</p>
  </InfoBlock>
);
