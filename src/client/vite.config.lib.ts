/**
 * Vite Library Build Configuration
 *
 * This config is used for building the npm package @jbcom/otter-river-rush.
 * It outputs to ./dist within src/client for npm publishing.
 *
 * Usage: vite build --config vite.config.lib.ts
 */

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'OtterRiverRush',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/postprocessing',
        '@react-three/rapier',
        '@jbcom/strata',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          three: 'THREE',
        },
        // Use named exports for better consumer compatibility
        exports: 'named',
        // Preserve module structure for tree-shaking
        preserveModules: false,
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Minify for production
    minify: 'esbuild',
  },
});
