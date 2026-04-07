/// <reference types="vitest" />
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In ESM, __dirname is not available.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@test": path.resolve(__dirname, "./src/test"),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      exclude: ["src/test/e2e/**", "node_modules/**"],
    },
  };
});
