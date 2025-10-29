import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ["react", "react-dom", "scheduler"], // ✅ This is critical!
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ["leaflet", "react-leaflet"],
          recharts: ["recharts"],
        },
      },
    },
  },
});