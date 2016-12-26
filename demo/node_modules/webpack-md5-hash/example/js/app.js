"use strict";

require.ensure('./module', function (require) {
    var module = require('./module');
    console.log(module);
});