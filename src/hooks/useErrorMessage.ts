import { useState, useEffect } from "react";

export const useErrorMessage = (message = "", onUnmount?: () => void) => {
  const [errorMessage, setErrorMessage] = useState(message);

  useEffect(() => {
    setErrorMessage(message);

    return () => {
      if (onUnmount && errorMessage) {
        onUnmount();
      }
    };
  }, [message, errorMessage, onUnmount]);

  return {
    errorMessage,
    setErrorMessage,
  };
};
