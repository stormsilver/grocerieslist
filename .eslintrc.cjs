module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  globals: {
    vi: true,
  },
  plugins: ['prettier'],
  extends: ['react-app', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-plusplus': ['off'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-param-reassign': ['off'],
  },
};
