"use strict";

var WebpackMd5Hash = require('../plugin/webpack_md5_hash');
var path = require('path');


var src = path.join(__dirname, '/js'),
    dest = path.join(__dirname, "/dest");

module.exports = {
    context: src,
    entry: {
        app: './app.js'
    },
    output: {
        path: dest,
        filename: "[name].js",
        chunkFilename: "[chunkhash].[id].chunk.js"
    },
    plugins: [
        new WebpackMd5Hash()
    ]
};