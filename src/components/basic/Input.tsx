import React, { InputHTMLAttributes } from "react";
import styled from "styled-components";
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

const InputContainerEl = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputWrapperEl = styled.div<{ disabled?: boolean }>`
  border: 1px solid ${PALETTE.grey};
  border-radius: 0.125rem;
  background-color: ${PALETTE.white};
  flex: 1;
  height: 100%;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const InputEl = styled.input`
  padding: 0.55rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
  border-radius: 0.125rem;
  border: none;
  background-color: transparent;
  width: 100%;
  min-width: 0;

  &::placeholder {
    color: ${PALETTE.black40};
  }
`;

const RightTextEl = styled.div`
  margin-left: 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
`;

const NoteEl = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.4rem;
  color: ${PALETTE.black60};
`;

const ErrorEl = styled(NoteEl)`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.red};
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  rightElement?: string;
  note?: React.ReactNode;
  error?: string;
}

export const Input = ({
  id,
  label,
  rightElement,
  note,
  error,
  ...props
}: InputProps) => (
  <WrapperEl>
    {label && <LabelEl htmlFor={id}>{label}</LabelEl>}
    <InputContainerEl>
      <InputWrapperEl disabled={props.disabled}>
        <InputEl id={id} aria-invalid={!!error} {...props} />
      </InputWrapperEl>
      {rightElement && <RightTextEl>{rightElement}</RightTextEl>}
    </InputContainerEl>
    {error && <ErrorEl>{error}</ErrorEl>}
    {note && <NoteEl>{note}</NoteEl>}
  </WrapperEl>
);
