import path from "path";
import { Configuration } from "webpack";
import CopyPlugin from "copy-webpack-plugin";

const EXTENSION_DIRECTORY = path.resolve(__dirname, "extension");
const SRC_DIRECTORY = path.resolve(__dirname, "src");

const config: Configuration = {
  context: SRC_DIRECTORY,
  entry: {
    mainScript: {
      import: "./chrome_scripts/contents/main_scripts.ts",
      filename: "./content_scripts/main_scripts.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "config/manifest.json", to: EXTENSION_DIRECTORY },
        { from: "assets/icons/*", to: EXTENSION_DIRECTORY },
      ],
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": SRC_DIRECTORY,
    },
  },
  output: {
    filename: "[name].bundle.js",
    path: EXTENSION_DIRECTORY,
    clean: true,
  },
  optimization: {
    minimize: false,
  },
};

export default config;
