import { defineConfig } from "astro/config";

// Placeholder domain, confirm before launch (see REVIEW.md).
export default defineConfig({
  site: "https://www.drnaveengovind.com",
  output: "static",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto"
  },
});
