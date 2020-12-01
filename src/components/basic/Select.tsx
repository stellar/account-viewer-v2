import React, { SelectHTMLAttributes } from "react";
import styled from "styled-components";
import { ReactComponent as IconDropdown } from "assets/svg/icon-dropdown.svg";
import { FONT_WEIGHT, PALETTE } from "constants/styles";

const WrapperEl = styled.div`
  width: 100%;
`;

const LabelEl = styled.label`
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: ${PALETTE.black};
  font-weight: ${FONT_WEIGHT.medium};
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: block;
`;

const SelectWrapperEl = styled.div<{ disabled?: boolean }>`
  border: 1px solid ${PALETTE.grey};
  border-radius: 0.125rem;
  background-color: ${PALETTE.white};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const SelectEl = styled.select`
  height: 100%;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
  border-radius: 0.125rem;
  border: none;
  background-color: transparent;
  flex: 1;
  min-width: 0;
  appearance: none;
`;

const IconWrapperEl = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: 0.6875rem;
  right: 0.6rem;
  pointer-events: none;

  svg {
    width: 0.5rem;
    height: 0.5rem;
    fill: ${PALETTE.black};
  }
`;

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  children: React.ReactNode;
}

export const Select = ({ id, label, children, ...props }: SelectProps) => (
  <WrapperEl>
    {label && <LabelEl htmlFor={id}>{label}</LabelEl>}
    <SelectWrapperEl disabled={props.disabled}>
      <SelectEl id={id} {...props}>
        {children}
      </SelectEl>
      <IconWrapperEl aria-hidden="true">
        <IconDropdown />
      </IconWrapperEl>
    </SelectWrapperEl>
  </WrapperEl>
);
