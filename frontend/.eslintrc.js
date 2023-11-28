module.exports = {
  root: true,
  extends: "@react-native",
  parser: "@babel/eslint-parser",
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": 0,
    "react-native/no-inline-styles": 0,
    "no-shadow": "off",
  },
};
