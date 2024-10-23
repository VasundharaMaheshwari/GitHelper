import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: { globals: {
    ...globals.node,
    ...globals.browser}},
  rules: {
    'no-unused-vars': 'warn',
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'eqeqeq': ['error', 'always'],
    'no-console': 'warn',
    'indent': ['error', 2],
    'no-var': 'error'
  }},
  pluginJs.configs.recommended,
];