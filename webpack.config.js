/* eslint-env node */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      'react-mdl/extra/material.min.js',
      './index.html',
      './src/index.js'
    ]
  },
  output: {
    filename: 'static/app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
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
      }
    ]
  },
  externals: {
    // 'moment': 'moment',
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'react-router': 'ReactRouter',
    // 'superagent': 'superagent'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('static/app.css'),
    new CopyWebpackPlugin([
        { from: 'images', to: 'static' }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};


if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        semicolons: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}
