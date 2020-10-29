import Amplitude from "amplitude-js";

const instance = Amplitude.getInstance();
instance.init(window._env_.AMPLITUDE_API_KEY, undefined, {
  trackingOptions: {
    ip_address: false,
  },
});

type Properties = {
  [key: string]: any;
};

export const logEvent = (type: string, properties?: Properties) => {
  console.log(
    `[TRACKING]: ${type}: ${properties ? JSON.stringify(properties) : ""}`,
  );

  if (properties) {
    // Override the IP so we don't collect it
    // eslint-disable-next-line no-param-reassign
    properties.ip = "";
  }

  // Track only production URL (exclude all dev URLs)
  if (window.location.host === "accountviewer.stellar.org") {
    instance.logEvent(type, properties);
  }
};
