import React from "react";
import "./styles.scss";

interface BannerProps {
  children: React.ReactNode;
}

export const Banner: React.FC<BannerProps> = ({ children }) => (
  <div className="Banner">{children}</div>
);
