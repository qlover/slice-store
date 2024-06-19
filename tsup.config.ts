import { Options, defineConfig } from 'tsup';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.WORK_ENV === 'prod';

console.log('[Tsup Build ENV]', process.env.WORK_ENV);

const commonConfig: Options = {
  minify: isProd,
  sourcemap: !isProd,
  shims: true,
  clean: true,
  dts: true
};

export default defineConfig([
  {
    format: ['esm', 'cjs', 'iife'],
    entry: ['./src/index.ts'],
    outDir: 'dist',
    platform: 'neutral',
    globalName: 'fy',
    outExtension({ format }) {
      if (format === 'iife') return { js: '.js' };
      return { js: `.${format}.js` };
    },
    ...commonConfig
  }
]);
