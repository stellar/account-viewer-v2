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

const InputWrapperEl = styled.div`
  border: 1px solid ${PALETTE.grey};
  border-radius: 0.125rem;
  background-color: ${PALETTE.white};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputEl = styled.input`
  height: 100%;
  padding: 0.55rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${PALETTE.black};
  border-radius: 0.125rem;
  border: none;
  background-color: transparent;
  flex: 1;
  min-width: 0;

  &::placeholder {
    color: ${PALETTE.black40};
  }
`;

const RightTextEl = styled.div`
  margin: 0.2rem 0.75rem 0 0.2rem;
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
    <InputWrapperEl>
      <InputEl id={id} aria-invalid={!!error} {...props} />
      {rightElement && <RightTextEl>{rightElement}</RightTextEl>}
    </InputWrapperEl>
    {error && <ErrorEl>{error}</ErrorEl>}
    {note && <NoteEl>{note}</NoteEl>}
  </WrapperEl>
);
