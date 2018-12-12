const { webpackDevServerBefore } = require("./hermione/mocks/server-lib")

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: 'dist/files',
  devServer: {
    before: webpackDevServerBefore
  }
};
