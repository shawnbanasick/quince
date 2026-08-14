import { defineConfig, withFilter } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    withFilter(
      svgr({
        /* your options */
      }),
      { load: { id: /\.svg\?react$/ } },
    ),
    react(),
  ],
  tests: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup",
  },
});
