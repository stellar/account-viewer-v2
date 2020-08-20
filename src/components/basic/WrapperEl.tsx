import styled from "styled-components";
import { SCREEN_SIZES } from "constants/styles";

export const WrapperEl = styled.div`
  padding: 0 1rem;

  @media (min-width: ${SCREEN_SIZES.mobile}px) {
    padding: 0 3rem;
  }
`;
