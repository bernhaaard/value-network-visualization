import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Happy-dom for DOM environment (faster than jsdom)
    environment: "happy-dom",

    // Enable global APIs (describe, it, expect, etc.)
    globals: true,

    // Test file patterns
    include: ["**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],

    // Path resolution (Next.js style)
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/": path.resolve(__dirname, "./src/"),
    },

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "dist/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts", // barrel exports
      ],
    },

    // Disable for debugging if needed
    // fileParallelism: false,
  },
});
