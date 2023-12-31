import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mix from 'vite-plugin-mix';

export default defineConfig({
  plugins: [
    vue(),
    mix({
      handler: './api.js'
    })
  ]
});
