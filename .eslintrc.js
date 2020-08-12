module.exports = {
  extends: ["@stellar/eslint-config"],
  rules: {
    "no-console": 0,
    "import/no-unresolved": "off",
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
    // TODO: remove once @stellar/eslint-config is updated
    "no-param-reassign": 0,
  },
};
