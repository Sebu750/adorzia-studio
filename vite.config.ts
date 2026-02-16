import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
<<<<<<< HEAD
    strictPort: true,  // Prevent auto port switching
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  build: {
    // NFR 1.1: Performance optimization for LCP < 1.2s
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
        },
      },
    },
    // Code splitting and tree shaking
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
  },
  // NFR 1.4: Image optimization for high-res fashion imagery
  assetsInlineLimit: 4096, // Inline assets < 4KB
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
}));
