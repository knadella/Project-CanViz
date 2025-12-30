import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    // For GitHub Pages project sites, built assets must be served under /<repo>/.
    // In dev, keep base as / so local URLs behave normally.
    base: command === "serve" ? "/" : "/Project-CanViz/",
  };
});



