module.exports = {
  extends: ["@stellar/eslint-config"],
  rules: {
    "no-console": 0,
    "import/no-unresolved": "off",
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
    "react/prop-types": 0,
  },
};
