module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    ecmaVersion: 2018,
    sourceType: 'module',
    useJSXTextNode: true
  },
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  settings: {
    'import/resolver': {
      'typescript': {},
    }
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    'func-names': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'react/jsx-filename-extension': 'off',
  },
  globals: {
    afterAll: true,
    afterEach: true,
    beforeAll: true,
    beforeEach: true,
    describe: true,
    expect: true,
    fail: true,
    it: true,
    jest: true,
  }
};
