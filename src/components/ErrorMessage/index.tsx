import React from "react";
import "./styles.scss";

interface ErrorMessageProps {
  message?: string;
  marginTop?: string;
  marginBottom?: string;
  textAlign?: "left" | "center" | "right";
  fontSize?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  marginTop = "0",
  marginBottom = "0",
  textAlign = "left",
  fontSize = "inherit",
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="ErrorMessage"
      style={{ marginTop, marginBottom, textAlign, fontSize }}
    >
      {message}
    </div>
  );
};
