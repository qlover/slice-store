import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { builtinModules } from 'module';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    lib: {
      entry: 'src/index.ts',
      name: 'sliceStoreReact',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) =>
        format === 'cjs' ? 'index.cjs' : `index.${format}.js`
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {})
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@qlover/slice-store': 'SliceStore'
        }
      }
    }
  }
});
