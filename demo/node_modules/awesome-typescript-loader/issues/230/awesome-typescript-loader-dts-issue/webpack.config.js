var path = require('path');

var clientBase = __dirname + '/Client/';

function c(s) {
    return path.resolve(clientBase + s);
}

module.exports = {
    entry: {
        'main': c('src/main.ts')
    },
    output: {
        filename: 'main.js',
        publicPath: '/',
        path: path.resolve(__dirname + '/dist/')
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: 'awesome-typescript?tsconfig=Client/tsconfig.json'
            }
        ]
    }
}