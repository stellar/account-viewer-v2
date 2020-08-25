import React, { InputHTMLAttributes } from "react";
import styled from "styled-components";
import { PALETTE } from "constants/styles";
import { ReactComponent as IconCheckmark } from "assets/icons/icon-checkmark.svg";

const WrapperEl = styled.div`
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  input[type="checkbox"] + label::before {
    background-color: ${PALETTE.white};
  }

  input[type="checkbox"]:checked + label::before {
    background-color: ${PALETTE.purple};
    border-color: ${PALETTE.purple};
  }

  input[type="checkbox"]:checked + label span {
    display: flex;
  }
`;

const LabelEl = styled.label`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
  flex: 1;
  display: flex;
  position: relative;

  &::before {
    content: "";
    display: block;
    margin-right: 0.75rem;
    margin-top: 0.0625rem;
    width: 1rem;
    height: 1rem;
    border-radius: 0.125rem;
    border: 1px solid ${PALETTE.white40};
    box-shadow: 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.48);
    z-index: 1;
  }
`;

const IconWrapperEl = styled.span`
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 2;
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;

  svg {
    width: 0.6rem;
    height: 0.6rem;
    fill: ${PALETTE.white};
  }
`;

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const Checkbox = ({ id, label, ...props }: CheckboxProps) => (
  <WrapperEl>
    <input type="checkbox" id={id} {...props} />
    <LabelEl htmlFor={id}>
      {label}
      <IconWrapperEl aria-hidden="true">
        <IconCheckmark />
      </IconWrapperEl>
    </LabelEl>
  </WrapperEl>
);
