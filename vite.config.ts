import solid from 'solid-start/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import dns from 'dns';

export default defineConfig({
  plugins: [solid(), Icons({ compiler: 'solid' })],
  server: {
    host: true,
  },
});
