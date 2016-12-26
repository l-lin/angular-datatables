'use strict';

var fstream = require('fstream')
  , tar = require('tar')
  , zlib = require('zlib');


/**
 * Create a gzipped tar archive of `target`
 * `target`: full file name including the path.
 * Usage:
 * var archiver = require('node-archiver');
 * archiver(__dirname, '/path/to/file.tar.gz'); 
 */ 
module.exports = function(target, output, callback) {
  if (!target || !output) {
    console.error('You must pass in the appropriate target and output to build this app.');
    process.exit(1);
  }
  var directory = {
    path: target,
    type: 'Directory',
    filter: function () {
      var path = this.path.replace(target, '');
      return !path.match(/^(output)|^(\/dist\/)|(\.sass-cache\/)|(\.git\/)/);
    }
  };

  fstream.Reader(directory)
    .pipe(tar.Pack({noProprietary: false}))
    .pipe(zlib.createGzip())
    .pipe(fstream.Writer(output)
      .on('close', function(err){
        if (callback) {
          callback(err);
        } else if (err) {
          console.error('Failed to properly create', output);
          throw err;
        } else {
          console.log('Created', output);
        }
      }));
}
