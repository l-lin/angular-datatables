const express = require('express');
const proxy = require('express-http-proxy');
const webpack = require('webpack');
const path = require('path');

const config = require('./config');
const webpackConfig = require('./webpack.config');

const app = express();
const compiler = webpack(webpackConfig);

app.use(require('compression')());

app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
app.use(require('webpack-hot-middleware')(compiler));

app.use('/api', proxy(config.get('proxy'), {
  forwardPath: req => require('url').parse(req.url).path
}));

app.get(/^((?!(.js|.css|.ico)).)*$/, (req, res) => {
  res.sendFile(path.join(config.get('build-path'), 'index.html'));
});

const host = config.get('webpack-host');
const port = config.get('webpack-port');

app.listen(port, host);
