var webpack = require('webpack');

var config = {
  entry: './src/main.js',
  plugins: [],
  output: {
    filename: 'dist/unicode.bidirectional.js',
    library: 'UnicodeBidirectional',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  }
};

if (process.env.WEBPACK_ENV === 'minify') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.output.filename = 'dist/unicode.bidirectional.min.js';
}

module.exports = config;
