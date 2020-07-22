import React from "react";
import styled from "styled-components";

const TempLinkButtonEl = styled.div`
  margin-bottom: 20px;
  text-decoration: underline;
  cursor: pointer;
`;

interface SigninTrezorFormProps {
  onClose?: () => void;
}

export const SigninTrezorForm = ({ onClose }: SigninTrezorFormProps) => (
    <div>
      <div>Trezor</div>
      <TempLinkButtonEl onClick={onClose}>Cancel</TempLinkButtonEl>
    </div>
  );
