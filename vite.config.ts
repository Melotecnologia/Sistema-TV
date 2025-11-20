import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Isso impede o erro "process is not defined" no navegador
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY)
      }
    },
    build: {
      outDir: 'dist',
    }
  };
});
