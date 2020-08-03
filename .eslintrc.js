module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'no-console': 0,
    'no-unused-vars': 0,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
  },
};
