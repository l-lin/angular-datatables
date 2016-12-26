const webpack = require('webpack');
const merge = require('webpack-partial/merge').default;

const base = require('./base');
const config = require('../');

module.exports = merge({
  devtool: 'cheap-module-eval-source-map',
  entry: {
    bundle: [
      'webpack-hot-middleware/client?reload=true',
      'react-hot-loader/patch',
      ...base.entry.bundle
    ]
  },
  output: {
    filename: '[name].js',
    pathinfo: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devServer: {
    contentBase: config.get('src-path'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    publicPath: base.output.publicPath
  }
}, base);
