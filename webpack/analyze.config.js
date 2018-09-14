const BundleAnalyzer = require("webpack-bundle-analyzer");
const prod = require("./prod.config");

module.exports = {
  ...prod,
  plugins: [new BundleAnalyzer.BundleAnalyzerPlugin()]
};
