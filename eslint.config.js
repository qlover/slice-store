import globals from 'globals';
import vitest from 'eslint-plugin-vitest';
import * as eslintChain from '@qlover/fe-standard/eslint/index.js';
import reactEslint from './packages/slice-store-react/eslint.config.js';
import * as feDev from '@qlover/eslint-plugin-fe-dev';

const { createCommon, chainEnv } = eslintChain;

const allGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.vitest,
  ...vitest.environments.env.globals
};

function createVitestConfig() {
  const config = chainEnv({
    allGlobals,
    files: [
      'packages/**/__tests__/**/*.test.ts',
      'packages/**/__tests__/**/*.test.tsx',
      'packages/**/*.test.ts',
      'packages/**/*.test.tsx'
    ],
    plugins: {
      vitest
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vitest.environments.env.globals
      }
    }
  });
  return config;
}

const commonConfig = createCommon(['packages/**/*.{js,jsx}']);

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**', 'templates/**']
  },
  // common js and ts
  {
    ...commonConfig,
    plugins: {
      ...commonConfig.plugins,
      'fe-dev': feDev
    },
    rules: {
      ...commonConfig.rules,
      'fe-dev/ts-class-method-return': 'error'
    }
  },
  // createTslintRecommended(['packages/**/*.{ts,tsx}']),
  ...reactEslint.map((config) => {
    if (config.languageOptions?.globals) {
      return chainEnv({ allGlobals, ...config });
    }
    return config;
  }),

  // vitest
  createVitestConfig()
];
