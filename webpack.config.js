/* eslint-env node */
'use strict';

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (options) {
  options = Object.assign({
    hot: false,
    dev: false,
    host: undefined,
    port: undefined
  }, options);

  const config = {
    context: path.resolve('./src'),
    entry: {
      app: [
        './index.js',
        './favicon.ico',
        './static/drone.svg'
      ]
    },
    output: {
      filename: 'static/[name]-[hash].js',
      path: path.resolve('./dist'),
      publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.dev ? 'development' : 'production')
      }),
      new ExtractTextPlugin('static/app-[hash].css'),
      new HtmlWebpackPlugin({
        template: './index.html.ejs',
        inject: false,
        minify: {
          collapseWhitespace: true,
          minifyCSS: true
        }
      })
    ].concat(!options.dev ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        output: {
          semicolons: false
        }
      })
    ] : []),
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract(
            'css?sourceMap!' +
            'less?sourceMap'
          )
        },
        {
          test: /index\.html$/,
          loader: 'file?name=[name].[ext]'
        },
        {
          test: /\.(ico|svg)$/,
          loader: 'file?name=[name].[ext]'
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    externals: {
      'immutable': 'Immutable',
      'moment': 'moment',
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-redux': 'ReactRedux',
      'react-router': 'ReactRouter',
      'redux': 'Redux',
      'superagent': 'superagent'
    }
  };

  if (options.dev) {
    config.devtool = 'inline-source-map';
  }

  if (options.hot) {
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    Object.keys(config.entry).forEach(function (entryKey) {
      if (!Array.isArray(config.entry[entryKey])) {
        config.entry[entryKey] = [config.entry[entryKey]];
      }
      config.entry[entryKey].unshift('webpack-dev-server/client?http://' + options.host + ':' + options.port, 'webpack/hot/dev-server');
    });
  }

  return config;
};
