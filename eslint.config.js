import globals from 'globals';
import jest from 'eslint-plugin-jest';
import * as eslintChain from '@qlover/fe-standard/eslint/index.js';
import reactEslint from './packages/slice-store-react/eslint.config.js';

const { createCommon, createTslintRecommended, chainEnv } = eslintChain;
const allGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.jest
};

function createJESTConfig() {
  const config = chainEnv({
    allGlobals,
    files: [
      'packages/**/__tests__/*.test.ts',
      'packages/**/__tests__/*.test.tsx'
    ],
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
  createCommon(['packages/**/*.{js,jsx}']),
  // createTslintRecommended(['packages/**/*.{ts,tsx}']),
  ...reactEslint.map((config) => {
    if (config.languageOptions?.globals) {
      return chainEnv({ allGlobals, ...config });
    }
    return config;
  }),

  // jest
  createJESTConfig()
];
