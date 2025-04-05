import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: 'background/index.js'
      },
      output: {
        entryFileNames: 'background.js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome112'
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'content-scripts', dest: '.' },
        { src: 'styles', dest: '.' },
        { src: 'images', dest: '.' },
        { src: 'popup', dest: '.' },
        { src: 'options', dest: '.' }
      ]
    })
  ]
});
