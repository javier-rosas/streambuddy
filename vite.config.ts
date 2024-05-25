import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // Your main entry point for the React app
        contentScript: "src/extension-scripts/contentScripts/contentScript.js", // Path to your content script
        contentScriptWebApp:
          "src/extension-scripts/contentScripts/web-app/webApp.js", // Path to your content script for the web app
        background: "src/extension-scripts/serviceWorker/serviceWorker.js", // Path to your service worker
      },
      output: {
        entryFileNames: `assets/[name].js`, // This controls the naming of output files
      },
    },
  },
});
