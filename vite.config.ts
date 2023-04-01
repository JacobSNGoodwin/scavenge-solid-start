import solid from 'solid-start/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [solid(), Icons({ compiler: 'solid' })],
  server: {
    host: '127.0.0.1',
  },
  ssr: {
    // see next-js example
    // https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#using-drizzle-orm-in-nextjs-app-router
    external: ['better-sqlite3'],
  },
});
