import globals from 'globals';
import jest from 'eslint-plugin-jest';
import * as eslintChain from '@qlover/fe-standard/eslint/index.js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

const { createCommon, createTslintRecommended, chainEnv } = eslintChain;
const allGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.jest
};

function createBrowserConfig() {
  return chainEnv({
    allGlobals,
    files: ['packages/slice-store/**/*.ts'],
    languageOptions: {
      globals: globals.browser
    }
  });
}

function createReactConfig() {
  return {
    files: ['packages/slice-store-react/**/*.{tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  };
}

function createJESTConfig() {
  const config = chainEnv({
    allGlobals,
    files: ['packages/**/__tests__/*.test.ts'],
    plugins: {
      jest
    },
    languageOptions: {
      globals: {
        // ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    }
  });
  return config;
}

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**', 'templates/**']
  },
  // common js and ts
  createCommon(),
  createTslintRecommended(['packages/**/*.ts']),
  // browser
  createBrowserConfig(),
  // node
  // createNodeConfig(),
  // react
  createReactConfig(),
  // jest
  createJESTConfig()
];
