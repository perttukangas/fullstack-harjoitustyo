import generouted from '@generouted/react-router/plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generouted(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
      },
    },
  },
});