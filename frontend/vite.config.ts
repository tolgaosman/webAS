import { defineConfig } from "vite";
import { resolve } from "path";

// Plan §Faz 2: two entry points (public site + admin panel), output to dist/
// with assetsDir separated from the public/assets/ static folder so build
// output never collides with hand-managed uploads/images.
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin_panel.html"),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Local dev only: forwards API calls to the backend so the frontend
      // can keep using relative "/api/..." paths unchanged in all envs.
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
