# source map loader for webpack

Extracts SourceMaps for source files that as added as `sourceMappingURL` comment.

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)


### example webpack config

``` javascript
module.exports = {
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  }
};
```

This extracts all SourceMaps from all files. That's not so performance-wise so you may only want to apply the loader to relevant files.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
