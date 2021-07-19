import React from "react";
import { Layout } from "@stellar/design-system";
import "./styles.scss";

interface LayoutSectionProps {
  children: React.ReactNode;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ children }) => (
  <div className="LayoutSection">
    <Layout.Inset>{children}</Layout.Inset>
  </div>
);
