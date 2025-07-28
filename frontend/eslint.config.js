// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply Next.js core rules
    ...next.configs["core-web-vitals"],
    plugins: {
      "@next/next": next,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "no-unused-vars": "error",
      "prefer-const": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
      "react/jsx-boolean-value": ["error", "never"],
      "react/prop-types": "warn",
      "consistent-return": "error",
      eqeqeq: ["error", "always"],
      "prettier/prettier": "error",
    },
  },
];
