import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite configuration for optimized React build
export default defineConfig({
  plugins: [
    react(), // Enables React fast refresh and JSX transform
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Simplifies imports using "@/..."
    },
    // 👇 Added: prevent duplicate React / scheduler instances
    dedupe: ["react", "react-dom", "scheduler"],
  },

  build: {
    target: "esnext", // Outputs modern JS
    sourcemap: false, // Disable source maps for smaller production builds
    outDir: "dist",
    chunkSizeWarningLimit: 800, // Increase chunk size warning threshold

    rollupOptions: {
      output: {
        // Custom chunk splitting for large dependencies
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-leaflet") || id.includes("leaflet")) {
              return "leaflet";
            }
            if (id.includes("framer-motion")) {
              return "motion";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
            if (id.includes("recharts")) {
              return "charts";
            }
            if (id.includes("react-dom")) {
              return "react-dom";
            }
            if (id.includes("react")) {
              return "react";
            }
          }
          return "vendor";
        },

        // Clean file structure for output
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },

  server: {
    port: 5173,
    open: true, // Auto open in browser
    strictPort: true, // Prevent fallback to other ports
    host: true, // Allow LAN access
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-leaflet",
      "react-leaflet-cluster",
      "leaflet",
      "framer-motion",
      "recharts",
      "lucide-react",
    ],
  },
});
