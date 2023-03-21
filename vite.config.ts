import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      '/pb': 'http://127.0.0.1:8090/api',
    },
  },
});
