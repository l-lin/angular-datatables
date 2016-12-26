/**
 * @module read-package-json
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var _require = require("path");

var joinPath = _require.join;

var readPkg = require("read-pkg");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Reads the package.json in the current directory.
 *
 * @returns {object} package.json's information.
 */
module.exports = function readPackageJson() {
  var path = joinPath(process.cwd(), "package.json");
  return readPkg(path).then(function (body) {
    return {
      taskList: Object.keys(body.scripts || {}),
      packageInfo: { path: path, body: body }
    };
  });
};