import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

/** Kept for package-local tooling; real demo app lives in examples/playground. */
export default defineConfig({
  plugins: [react()]
});
