/* eslint-env node */
/* eslint-disable no-console */
'use strict';

const argv = require('yargs').argv;
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const WebpackDevServer = require('webpack-dev-server');

const port = 9000;
const drone = {
  scheme: argv.scheme,
  host: argv.host,
  server: `${argv.scheme}://${argv.host}`,
  wsServer: `${argv.scheme === 'https' ? 'wss' : 'ws'}://${argv.host}`,
  token: argv.token
};

const config = require('./webpack.config.js');
config.entry.app.unshift(`webpack-dev-server/client?http://localhost:${port}/`, 'webpack/hot/dev-server');
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: {
    // proxy to drone
    '/api/*': {
      target: drone.server,
      headers: {
        'Authorization': `Bearer ${drone.token}`
      },
      xfwd: true,
      changeOrigin: true
    }
  },
  // reduce the console noise
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

// proxy to drone websocket
const proxy = require('http-proxy').createProxyServer();
proxy.on('error', function () {
  // ignore errors (like websocket connection reset from drone) and just continue
});
server.listeningApp.on('upgrade', function (req, socket) {
  if (req.url.match(/^\/ws\//)) {
    proxy.ws(req, socket, {
      target: drone.wsServer,
      headers: {
        'Authorization': `Bearer ${drone.token}`
      },
      ws: true,
      changeOrigin: true
    });
  }
});

server.listen(9000, (err) => {
  if (err) return console.err(err);
  console.log(`Now listening on http://localhost:${port}`);
});
