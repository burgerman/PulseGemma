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
      host: true,
      proxy: {
        '/api/ollama': {
          target: 'http://127.0.0.1:11434',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ollama service offline' }));
              }
            });
          }
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 2000
    }
  };
});
