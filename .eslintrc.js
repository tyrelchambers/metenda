/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  rules: {
    "@typescript-eslint/consistent-type-imports": "off",
  },
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: {
    jest: {
      version: 27,
    },
  },
};
