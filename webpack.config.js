var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/app.js'
  },
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
          // activate source maps via loader query
          'css?sourceMap!' +
          'less?sourceMap'
        )
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('./dist/app.css')
  ]
};
