import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // Your main entry point for the React app
        contentScript: "src/contentScript/contentScript.js", // Path to your content script
      },
      output: {
        entryFileNames: `assets/[name].js`, // This controls the naming of output files
      },
    },
  },
});
