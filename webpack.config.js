/* eslint-env node */
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

const DEBUG = !process.env.NODE_ENV === 'production';

module.exports = {
  entry: [
    `${__dirname}/src/index.js`
  ],
  output: {
    filename: 'app.js',
    path: `${__dirname}/dist/static`,
    publicPath: '/',
    sourcePrefix: '  '
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'images/favicon.ico', to: 'favicon.ico' }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.NamedModulesPlugin()

  ],
  context: `${__dirname}/src`,
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { modules: false }],
              'react'
            ],
            plugins: [
              'react-hot-loader/babel'
            ],
            cacheDirectory: DEBUG
          }
        },
        include: [
          `${__dirname}/src`
        ]
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader', options: {
            strictMath: true,
            noIeCompat: true
          }
        }]
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'file-loader'
        }
      }

    ]
  }
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
    })
  ]);
}
