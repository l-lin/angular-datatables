# webpack-md5-hash

[![NPM](https://nodei.co/npm/webpack-md5-hash.png)](https://npmjs.org/package/webpack-md5-hash)

Plugin to replace a standard webpack chunkhash with md5.

## Installation

```
npm install webpack-md5-hash --save-dev
```

## Usage

Just add this plugin as usual.

``` javascript

// webpack.config.js

var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
    // ...
    output: {
        //...
        chunkFilename: "[chunkhash].[id].chunk.js"
    },
    plugins: [
        new WebpackMd5Hash()
    ]
};

```

## Development

### Setup Docker

* Install [Doker Toolbox](https://www.docker.com/docker-toolbox)
* Setup [Docker Machine](https://docs.docker.com/machine/get-started/)

### Generate Docker files

* Change versions on node and webpack in *versions.json*
* Run `./build.js gen_docker` to generate files

### Run tests

* Build Docker images `docker-compose build`
* Run tests `docker-compose up` or `docker-compose up | grep exited`

### Run tests for specific environment

> Example: you need test code on node v0.12 and webpack v1.8

* Build image `docker-compose build test_n_0.12_w_1.8`
* Run tests `docker-compose run --rm test_n_0.12_w_1.8`

And now instead of standard value of chunkhash you'll get a md5 based on chunk's modules.
