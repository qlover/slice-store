import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: false,
    minify: true,
    clean: true,
    outDir: 'dist'
  },
  {
    entry: ['src/index.ts'],
    format: 'esm',
    dts: {
      compilerOptions: {
        composite: false,
        rootDir: undefined
      }
    },
    outDir: 'dist'
  }
]);
