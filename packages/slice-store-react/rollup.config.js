import dts from 'rollup-plugin-dts';
import { readFileSync, rmSync } from 'fs';

const tsConfig = JSON.parse(readFileSync('./tsconfig.json'), 'utf-8');

const buildDir = tsConfig.compilerOptions.outDir;

const treeshake = {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false
};

// function cleanBuildDir() {
//   rmSync(buildDir, { recursive: true, force: true });
//   console.log(`slice-store-react ${buildDir} cleaned`);
// }

// cleanBuildDir();

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
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
