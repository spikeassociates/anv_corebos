const webpack = require("webpack");

const base = require("./base.config");
const GLOBALS = require("../config/globals/prod");

module.exports = {
  ...base,
  mode: "production",
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      GLOBALS
    })
  ],
  output: {
    ...base.output,
    publicPath: process.env.PUBLIC_PATH
  }
};
