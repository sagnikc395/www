import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  // Set to "/<repo-name>/" when deploying to a GitHub Pages project site.
  base: "/",
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
