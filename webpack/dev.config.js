const webpack = require("webpack");
const base = require("./base.config");
const GLOBALS = require("../config/globals/dev");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  ...base,
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.DefinePlugin({
      GLOBALS
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" })
  ],
  devServer: {
    port: 3000,
    host: "0.0.0.0",
    contentBase: "./dist",
    historyApiFallback: true,
    publicPath: "/"
  }
};
