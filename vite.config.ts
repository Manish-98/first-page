import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths work from both the project Pages root and nested PR previews.
  base: "./",
  plugins: [react()],
});
