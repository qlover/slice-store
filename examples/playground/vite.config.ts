import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const monorepoRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

export default defineConfig({
  plugins: [react()],
  root: '.',
  resolve: {
    // Point at package sources so playground tracks local changes without rebuild.
    alias: {
      '@qlover/slice-store': path.join(monorepoRoot, 'packages/slice-store/src'),
      '@qlover/slice-store-react': path.join(
        monorepoRoot,
        'packages/slice-store-react/src'
      )
    }
  },
  server: {
    port: 5173
  }
});
