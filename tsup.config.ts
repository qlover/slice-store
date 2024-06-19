import { Options, defineConfig } from 'tsup';

const currentNodeEnv = process.env.NODE_ENV;
const isProd = currentNodeEnv === 'production';

const commonConfig: Options = {
  minify: true,
  sourcemap: false,
  shims: true,
  clean: true,
  dts: true
};

export default defineConfig([
  {
    format: ['esm', 'cjs'],
    entry: ['./src/index.ts'],
    outDir: 'dist/core',
    platform: 'neutral',
    globalName: 'fy',
    outExtension({ format }) {
      if (format === 'iife') return { js: '.main.js' };
      return { js: `.${format}.js` };
    },
    ...commonConfig
  }
]);
