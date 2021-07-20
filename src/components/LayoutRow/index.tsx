import React from "react";
import "./styles.scss";

interface LayoutRowProps {
  children: React.ReactElement | React.ReactElement[];
  isFullWidth?: boolean;
}

export const LayoutRow: React.FC<LayoutRowProps> = ({
  children,
  isFullWidth,
}) => (
  <div className={`LayoutRow ${isFullWidth ? "LayoutRow--full-width" : ""}`}>
    {React.Children.map(children, (child) => child)}
  </div>
);
