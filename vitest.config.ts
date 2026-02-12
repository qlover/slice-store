import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use development build so React.act and react-dom/test-utils.act are available (React 19)
    env: { NODE_ENV: 'development' },
    projects: [
      {
        test: {
          name: 'packages',
          environment: 'jsdom',
          globals: true,
          include: ['packages/**/__tests__/**/*.test.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**']
        },
        resolve: {
          alias: {
            // Use source so tests run against TS source, not built dist
            '@qlover/slice-store': resolve(
              __dirname,
              'packages/slice-store/src/index.ts'
            )
          }
        }
      }
    ]
  }
});
