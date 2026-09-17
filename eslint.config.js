import js from '@eslint/js';
import globals from 'globals';
import vitest from 'eslint-plugin-vitest';
import * as eslintChain from '@qlover/fe-standard/eslint/index.js';
import qloverEslint from '@qlover/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

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
      'packages/**/__tests__/**/*.test.tsx'
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

const commonConfig = createCommon();

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default tseslint.config([
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      'examples/**'
    ]
  },

  {
    files: ['packages/**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      commonConfig
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@qlover-eslint': qloverEslint
    },
    rules: {
      ...qloverEslint.configs.recommended.rules,
      '@qlover-eslint/ts-class-override': 'off',
      '@qlover-eslint/require-root-testid': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // TypeScript overload signatures are duplicate class members by design
      'no-dupe-class-members': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },

  {
    files: ['packages/slice-store-react/**/*.{ts,tsx}'],
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
  },

  // vitest
  createVitestConfig()
]);
