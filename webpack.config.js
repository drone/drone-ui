var path = require('path');

module.exports = {
  entry: './scripts/index.js',
  devtool: 'source-map',
  output: {
    filename: './dist/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
