import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths work from both the project Pages root and nested PR previews.
  base: "./",
  plugins: [react()],
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/domain/**/*.ts", "src/application/**/*.ts"],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.type-test.ts",
        "src/domain/cv/sections.ts",
        "src/domain/cv/types.ts",
      ],
      reporter: ["text", "json-summary", "html"],
    },
  },
});
