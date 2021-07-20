import React from "react";
import "./styles.scss";

interface LabelAndValueProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export const LabelAndValue: React.FC<LabelAndValueProps> = ({
  label,
  children,
}) => (
  <div className="LabelAndValue">
    <label>{label}</label>
    <div className="LabelAndValue__container">{children}</div>
  </div>
);
