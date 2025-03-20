import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    base: '/VCDOS/',
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        clientPort: 3000
      }
    },
    // Vite exposes env variables on the special import.meta.env object
    define: {
      'process.env.DATABASE_URL': JSON.stringify(env.DATABASE_URL),
      'process.env.JWT_SECRET': JSON.stringify(env.JWT_SECRET)
    }
  };
});
