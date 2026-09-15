import js from "@eslint/js";
import globals from "globals";
import hooks from "eslint-plugin-react-hooks";
export default [
  { ignores: ["dist/**", "api-web/**", "emulator-web/**", "native-export/**", ".expo/**"] },
  { files: ["*.config.js"], languageOptions: { globals: globals.node } },
  {
    files: ["util/config.js"],
    languageOptions: { globals: { process: "readonly" } },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: { ...globals.browser, require: "readonly", __DEV__: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": hooks },
    rules: {
      ...js.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^[A-Z_]", argsIgnorePattern: "^_" },
      ],
    },
  },
];
