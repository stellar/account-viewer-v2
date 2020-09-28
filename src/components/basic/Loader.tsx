import React from "react";
import styled, { keyframes } from "styled-components";
import { PALETTE } from "constants/styles";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderEl = styled.div<{ size: string; color: string }>`
  position: relative;
  width: ${(props) => props.size};
  height: ${(props) => props.size};

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: calc(${(props) => props.size} * 0.8);
    height: calc(${(props) => props.size} * 0.8);
    margin: calc(${(props) => props.size} * 0.1);
    border: calc(${(props) => props.size} * 0.1) solid ${(props) => props.color};
    border-radius: 50%;
    animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${(props) => props.color} transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

export const Loader = ({
  size = "1rem",
  color = PALETTE.black60,
}: {
  size?: string;
  color?: string;
}) => (
  <LoaderEl size={size} color={color}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </LoaderEl>
);
