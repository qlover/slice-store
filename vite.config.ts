import { defineConfig } from 'vitest/config';

export default defineConfig({
  // plugins: [
  // FIXME: not override alias?
  //   viteMockPackage({
  //     onlyPackages: ['slice-store']
  //   })
  // ],
  test: {
    environment: 'node',
    globals: true,
    watch: false,
    include: ['packages/**/__tests__/**/*.test.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.changelog/**',
      '**/.github/**',
      '**/.husky/**',
      '**/.vscode/**',
      '**/.nx/**',
    ],
    alias: {
      '@qlover/slice-store': './packages/slice-store/__mocks__/index.ts',
    }
  }
});
