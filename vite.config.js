import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    // Use "/" for root deployment or "/repo-name/" for project sites
    // Set to "/" for deploying to root of GitHub Pages
    base: "/",
  };
});
