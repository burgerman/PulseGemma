import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'process.env.VLM_MODEL': JSON.stringify(env.VLM_MODEL || process.env.VLM_MODEL || 'gemini-robotics-er-2-preview')
    },
    envPrefix: ['VITE_', 'GEMINI_', 'VLM_'],
    server: {
      port: 3000,
      host: true
    }
  };
});
