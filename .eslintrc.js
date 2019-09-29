module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
