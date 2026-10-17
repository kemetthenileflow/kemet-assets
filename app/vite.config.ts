import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { syncSymbolCards } from './scripts/sync-symbol-cards.mjs';

export default defineConfig(async () => {
  await syncSymbolCards();
  return {
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
  };
});