import path from "node:path";

import { Volume, createFsFromVolume } from "memfs";
import webpack from "webpack";

export default (fixture, loaderOptions = {}, config = {}) => {
  const fullConfig = {
    mode: "development",
    devtool: config.devtool || false,
    context: path.resolve(__dirname, "../fixtures"),
    entry: path.resolve(__dirname, "../fixtures", fixture),
    output: {
      path: path.resolve(__dirname, "../outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
      publicPath: "/webpack/public/path/",
    },
    module: {
      rules: [
        {
          test: /\.(css|sss)$/i,
          use: [
            {
              loader: require.resolve("./testLoader"),
              options: {},
            },
            {
              loader: path.resolve(__dirname, "../../src"),
              options: loaderOptions || {},
            },
          ],
        },
      ],
    },
    plugins: [],
    ...config,
  };

  const compiler = webpack(fullConfig);

  if (!config.outputFileSystem) {
    const outputFileSystem = createFsFromVolume(new Volume());
    // Todo remove when we drop webpack@4 support
    outputFileSystem.join = path.join.bind(path);

    compiler.outputFileSystem = outputFileSystem;
  }

  return compiler;
};
