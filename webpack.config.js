const path = require("path");

module.exports = (env) => {
  const suffix = env === "prod" ? ".min" : "";

  const config = {
    mode: env === "prod" ? "production" : "development",
    entry: {
      "cat-carousel": "./src/components/cat-carousel/index.js",
      "show-products": "./src/components/show-products/index.js",
      "single-product": "./src/components/single-product/index.js",
      calculator: "./src/components/calculator/index.js",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"],
        },
      ],
    },
    output: {
      filename: `[name].delice-react${suffix}.js`,
      chunkFilename: `[name].delice-react${suffix}.js`,
      path: path.resolve(__dirname, "dist"),
      publicPath:
        env === "prod"
          ? "/wp-content/plugins/react-components/dist/"
          : "/delice/wp-content/plugins/react-components/dist/",
    },
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2,
            minSize: 0,
          },
        },
      },
      chunkIds: "named", // To keep filename consistent between different modes (for example building only)
    },
  };
  if (env === "dev") {
    config.devtool = "inline-source-map";
  }

  return config;
};
