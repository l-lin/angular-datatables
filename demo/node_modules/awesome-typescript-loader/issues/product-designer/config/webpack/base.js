const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const config = require('../');

module.exports = {
  devtool: 'eval',
  entry: {
    bundle: ['babel-polyfill', path.join(config.get('src-path'), 'index.tsx')]
  },
  output: {
    path: config.get('build-path'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/assets/'
  },
  module: {
    preLoaders: [
      { test: /\.(ts|tsx)?$/, loader: 'tslint' }
    ],
    loaders: [
      {
        name: 'ts',
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript',
        query: {
          forkChecker: true,
          forkCheckerSilent: true,
          useBabel: true,
          useCache: true,
          modules: 'es2015'
        }
      },
      { name: 'css', test: /\.css?$/, loader: 'style!css' },
      { name: 'sass', test: /\.scss?$/, loader: 'style!css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]&sourceMap!sass' },
      { test: /\.json?$/, loader: 'json' },
      { test: /\.(woff|woff2)?$/, loader: 'url?limit=10000&name=[name]-[hash:6].[ext]' },
      { test: /\.(png|jpg|jpeg|gif|svg)?$/, loader: 'url?limit=10000&name=[name]-[hash:6].[ext]' },
      { test: /\.(ttf|eot)?$/, loader: 'file?name=[name]-[hash:6].[ext]' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ForkCheckerPlugin(),
    new ProgressBarPlugin(),
    new CleanPlugin(['build'], { root: config.get('project-path'), verbose: false }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlPlugin({
      title: 'Nordic Insurance Software - Product Designer',
      alwaysWriteToDisk: true,
      template: './config/webpack/index.ejs'
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(config.get('NODE_ENV')) },
      __DEV__: config.get('NODE_ENV') === 'development',
      __TEST__: config.get('NODE_ENV') === 'test',
    }),
    new HtmlHarddiskPlugin()
  ]
};
