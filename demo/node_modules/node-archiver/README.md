Node Archiver
=============

Super simple Node utility to create a gzipped tar archive.

Install
-------

	npm install --save node-archiver

Usage
-----

```javascript
  var archiver = require('node-archiver');
  archiver(__dirname, './dist/my-archive.tar.gz');
```

You can pass an optional callback to archiver:
	
```javascript
archiver(__dirname, './dist/my-archive.tar.gz', function(err) {
  if (err) { throw err; }
  // Done!
});
```

Create an archive in the dist/ directory of your project:

```
./node_modules/node-archiver/bin/create_dist
```

Adding the above line to your build process will create a distributable .tar.gz archive in the dist/ directory of your project. The name of the file will match the name attribute in your `package.json`.

Release Notes
-------------

**0.1.0** Initial Release  
**0.1.1** Bug Fix  
**0.2.0** Added `bin/create_dist` for easier integration into a build process.  
**0.3.0** Dependency updates to latest fstream and tar.

