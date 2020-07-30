import { useState, useEffect } from "react";

export const useErrorMessage = (message = "", onUnmount?: () => void) => {
  const [errorMessage, setErrorMessage] = useState(message);

  useEffect(() => {
    setErrorMessage(message);
  }, [message]);

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
