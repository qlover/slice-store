import { Options, defineConfig } from 'tsup';
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'] });

const env = process.env.NODE_ENV;
console.log('[env is]', env);
const isProd = env === 'production';

const commonConfig: Options = {
  minify: isProd,
  sourcemap: !isProd,
  shims: true,
  clean: true,
  dts: true
};

export default defineConfig([
  {
    format: ['esm', 'cjs'],
    entry: ['./packages/main/index.ts'],
    outDir: 'dist',
    platform: 'neutral',
    globalName: 'SliceStore',
    outExtension({ format }) {
      if (format === 'iife') return { js: '.js' };
      return { js: `.${format}.js` };
    },
    ...commonConfig
  }
]);
