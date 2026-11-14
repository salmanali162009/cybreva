import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Code splitting for smaller production chunks
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
            return 'ui';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'forms';
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-gfm')) {
            return 'markdown';
          }
        },
      },
    },
  },

  // Preview server config
  preview: {
    port: 5173,
  },

  // Dev server
  server: {
    port: 5173,
  },
});
