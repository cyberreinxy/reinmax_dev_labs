module.exports = [
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        commonjs: true,
        es2021: true,
        node: true,
        jest: true,
      },
    },
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-console": "off",
    },
  },
];
