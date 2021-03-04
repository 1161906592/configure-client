module.exports = {
  publicPath: ".",
  configureWebpack: {
    externals: {
      vue: "Vue",
      "element-ui": "ELEMENT"
    }
  }
};
