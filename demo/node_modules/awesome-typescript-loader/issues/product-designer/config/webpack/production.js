const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-partial/merge').default;

const base = require('./base');
const config = require('../');

module.exports = merge({
  devtool: 'source-map',
  module: {
    loaders: [
      { name: 'css', loader: ExtractTextPlugin.extract({ notExtractLoader: 'style', loader: 'css?sourceMap' }) },
      { name: 'sass', loader: ExtractTextPlugin.extract({ notExtractLoader: 'style', loader: 'css?modules&sourceMap!sass' }) }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new ExtractTextPlugin('[name]-[contenthash].css')
  ],
  stats: {
    children: false
  }
}, base);
