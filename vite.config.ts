/// <reference types="vitest" />
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In ESM, __dirname is not available.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
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
      coverage: {
        reporter: ["text", "json", "html", "json-summary"],
        include: ["src/**"],
        exclude: [
          "src/test/**",
          "**/*.d.ts",
          "src/App.tsx",
          "src/index.tsx",
          "src/features/analyst/**",
          "src/features/dashboard/**",
          "src/features/history/**",
          "src/features/upload/**",
          "src/shared/components/**",
          "src/shared/services/geminiService.ts",
          "src/shared/utils/audioUtils.ts",
        ],
        thresholds: {
          lines: 80,
        },
      },
    },
  };
});
