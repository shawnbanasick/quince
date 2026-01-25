import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup",
  },
  plugins: [react(), svgr()],
});
