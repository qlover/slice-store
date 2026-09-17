import { createRoot } from 'react-dom/client';
import { App } from './App';

// Playground intentionally skips StrictMode so render-count demos
// reflect real emit batching (StrictMode double-renders on each update in dev).
createRoot(document.getElementById('root')!).render(<App />);
