import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";
import path from "path";

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv.mode === "production";
  const envFile = isProduction ? ".env.production" : ".env.development";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      background: "./src/extension-scripts/serviceWorker/serviceWorker.js",
      contentScript: "./src/extension-scripts/contentScripts/contentScript.js",
      streamingContentScript:
        "./src/extension-scripts/contentScripts/stream/stream.tsx",
      contentScriptWebApp:
        "./src/extension-scripts/contentScripts/web-app/webApp.js",
      popup: "./src/main.tsx", // Updated to point to the main entry file for the popup
    },
    output: {
      filename: "assets/[name].js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // Clean the output directory before emit
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src"), // Ensure this points to the src directory
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html", // Make sure this path is correct
        filename: "index.html",
        chunks: ["popup"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "public", to: "." },
          { from: "src/manifest.json", to: "." },
        ],
      }),
      new Dotenv({
        path: envFile, // Load the correct .env file
      }),
    ],
    devtool: "source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
      devMiddleware: {
        writeToDisk: true, // Write files to disk in development mode
      },
    },
  };
};
