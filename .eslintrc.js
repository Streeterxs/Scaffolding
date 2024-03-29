module.exports = {
   env: {
      browser: true,
      es2021: true,
      node: true,
   },
   extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
   },
   plugins: ['@typescript-eslint', 'jest', 'no-only-tests'],
   rules: {
      'jest/no-test-prefixes': 'error',
      'no-only-tests/no-only-tests': 'error',
      '@typescript-eslint/no-var-requires': 'warn',
      'no-undef': 'warn',
   },
   ignorePatterns: ['.eslintrc.js'],
};
