const path = require("path");
const dest = path.resolve(__dirname, "../dist");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  entry: {
    app: ["@babel/polyfill", "./packages/core/src/index.jsx"]
  },
  output: {
    path: dest,
    publicPath: "/",
    filename: "main.js"
  }
};
