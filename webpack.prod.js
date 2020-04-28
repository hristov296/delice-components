const path = require("path");

module.exports = {
  mode: "production",
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
    filename: "[name].delice-react.min.js",
    chunkFilename: "[name].delice-react.min.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/wp-content/plugins/react-components/dist/",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  optimization: {
    // splitChunks: {
    //   chunks: "all",
    // },
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
    moduleIds: "hashed",
  },
};
