import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import vitest from 'eslint-plugin-vitest';
import qloverLint, { restrictSpecificGlobals } from '@qlover/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { readFileSync } from 'fs';

const prettierConfig = JSON.parse(readFileSync('./.prettierrc.json', 'utf-8'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  globalIgnores([
    '**/dist',
    '**/node_modules',
    'eslint.config.js',
    'commitlint.config.js',
    '**/ts-build',
    '.nx'
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'unused-imports': unusedImports,
      import: importPlugin,
      prettier: prettierPlugin,
      '@qlover-eslint': qloverLint,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@qlover-eslint/ts-class-method-return': 'error',
      '@qlover-eslint/ts-class-member-accessibility': 'error',
      '@qlover-eslint/ts-class-override': 'error',
      '@qlover-eslint/require-root-testid': [
        'error',
        {
          exclude: ['/^[A-Z]/']
        }
      ],
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports'
        }
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type'
          ],
          pathGroupsExcludedImportTypes: ['type'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal'
            }
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      'prettier/prettier': [
        'error',
        prettierConfig,
        {
          // 仅用于单独部署时对 eslint prettier 插件自动查找 prettierrc 时报错
          // 注意: vscode 等编辑器会失效, 作为单独项目开发时可以去掉
          usePrettierrc: false
        }
      ],
      'import/no-default-export': 'error'
    }
  },
  
  {
    name: 'lint-make',
    files: ['make/**/*.js'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },
  {
    name: 'lint-vitest',
    files: ['packages/**/__tests__/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      vitest
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vitest.environments.env.globals
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@qlover-eslint/ts-class-member-accessibility': 'off',
      '@qlover-eslint/ts-class-override': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ]
    }
  },
  {
    files: ['**/*.config.ts'],
    rules: {
      'import/no-default-export': 'off'
    }
  }
]);
