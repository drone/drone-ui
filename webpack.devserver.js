/* eslint-env node */
'use strict';

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const WebpackDevServer = require('webpack-dev-server');

module.exports = function (host, port, hot, drone, done) {
  const compiler = webpack(webpackConfig({host: host, port: port, hot: hot, dev: true}));
  const server = new WebpackDevServer(compiler, {
    proxy: {
      '/api/*': {
        target: drone.host,
        headers: {
          'Authorization': `Bearer ${drone.token}`
        },
        xfwd: true,
        changeOrigin: true
      },
      '/ws/*': {
        target: drone.host,
        headers: {
          'Authorization': `Bearer ${drone.token}`
        },
        xfwd: true,
        ws: true,
        changeOrigin: true
      }
    },
    contentBase: './src',
    inline: true,
    hot: hot,
    historyApiFallback: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      modules: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
      cached: true,
      chunkOrigins: true,
      children: false
    }
  });

  server.listen(port, host, (err) => err ? done(err) : null);

  let valid = false;
  compiler.plugin('done', () => {
    if (!valid) {
      valid = true;
      done();
    }
  });
};
