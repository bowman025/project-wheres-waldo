import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, '../../'), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_DEV_TOOLS': JSON.stringify(env.VITE_DEV_TOOLS),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});