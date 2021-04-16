import styled from "styled-components";
import { PALETTE } from "constants/styles";
import { Loader } from "@stellar/design-system";

const InlineLoadingEl = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  div:nth-child(1) {
    flex-shrink: 0;
  }
`;

const InlineLoadingTextEl = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black60};
  margin-left: 0.5rem;
`;

export const InlineLoaderWithText = ({
  visible,
  children,
}: {
  visible: boolean;
  children: string;
}) => {
  if (!visible) {
    return null;
  }

  return (
    <InlineLoadingEl>
      <Loader />
      <InlineLoadingTextEl>{children}</InlineLoadingTextEl>
    </InlineLoadingEl>
  );
};
