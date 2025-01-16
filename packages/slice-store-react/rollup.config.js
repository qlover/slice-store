import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { builtinModules } from 'module';
import { readFileSync, rmSync } from 'fs';
import { searchEnv } from '@qlover/fe-scripts';

const env = searchEnv({ logger: console });
const pkg = JSON.parse(readFileSync('./package.json'), 'utf-8');
const tsConfig = JSON.parse(readFileSync('./tsconfig.json'), 'utf-8');

const isProduction = env.get('NODE_ENV') === 'production';
const buildDir = tsConfig.compilerOptions.outDir;

const treeshake = {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false
};

const defaultExternal = [
  ...builtinModules,
  ...builtinModules.map((mod) => `node:${mod}`),
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
];

function createPlugin(minify) {
  return [
    resolve({
      preferBuiltins: false
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        include: ['src']
      }
    }),
    minify && terser()
  ].filter(Boolean);
}

function cleanBuildDir() {
  rmSync(buildDir, { recursive: true, force: true });
  console.log(`slice-store ${buildDir} cleaned`);
}

cleanBuildDir();

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: 'src/index.ts',
    external: defaultExternal,
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@qlover/slice-store': 'SliceStore'
        }
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@qlover/slice-store': 'SliceStore'
        }
      },
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'SliceStoreReact',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@qlover/slice-store': 'SliceStore'
        }
      }
    ],
    plugins: createPlugin(isProduction),
    treeshake
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es'
      }
    ],
    plugins: [dts()],
    treeshake
  }
];

export default config;
