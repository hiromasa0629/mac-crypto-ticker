import { defineConfig } from 'vite';

import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config
export default defineConfig({
  publicDir: 'assets',
  define: {
    'process.env.ALCHEMY_APIKEY': JSON.stringify(process.env.ALCHEMY_APIKEY),
  },
});
