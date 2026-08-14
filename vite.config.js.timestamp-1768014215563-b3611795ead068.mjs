// vite.config.js
import { defineConfig } from "file:///D:/CODE/quince/node_modules/vite/dist/node/index.js";
import react from "file:///D:/CODE/quince/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///D:/CODE/quince/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [svgr(), react()],
  tests: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup",
  },
});
export { vite_config_default as default };
