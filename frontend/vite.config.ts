import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Plan §Faz 5: two entry points (public site + admin panel), react
// plugin, output to dist/ with assetsDir separated from the public/
// static folder. `admin.css` MUST be imported before `styles.css`
// nowhere else — see src/entries/admin/main.tsx's docblock for the
// cascade-order reason.
export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [react()],
  define: {
    __MOCK_API__: mode === "mock",
  },
  build: {
    outDir: "dist",
    assetsDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Local dev only: forwards API calls to the backend so the
      // frontend can keep using relative "/api/..." paths unchanged in
      // all envs. Point at `php artisan serve`'s port.
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
}));
