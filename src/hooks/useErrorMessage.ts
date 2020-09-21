import { useState, useEffect } from "react";

export const useErrorMessage = ({
  initialMessage,
  onUnmount,
}: {
  initialMessage?: string;
  onUnmount?: () => void;
}) => {
  const [errorMessage, setErrorMessage] = useState(initialMessage);

  useEffect(() => {
    setErrorMessage(initialMessage);
  }, [initialMessage]);

  useEffect(
    () => () => {
      if (onUnmount && errorMessage) {
        onUnmount();
      }
    },
    [errorMessage, onUnmount],
  );

  return {
    errorMessage,
    setErrorMessage,
  };
};
