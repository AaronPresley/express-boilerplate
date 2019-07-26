module.exports =  {
  parser:  '@typescript-eslint/parser',
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
    ecmaFeatures:  {
      jsx:  true,
    },
  },
  rules:  {
    "@typescript-eslint/no-unused-vars": "off",
  },
  settings:  {
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};