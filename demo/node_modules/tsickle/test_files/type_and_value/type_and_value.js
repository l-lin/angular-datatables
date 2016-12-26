goog.module('test_files.type_and_value.type_and_value');var module = module || {id: 'test_files/type_and_value/type_and_value.js'};
var conflict = goog.require('test_files.type_and_value.module');
// This test deals with symbols that are simultaneously types and values.
// Use a browser built-in as both a type and a value.
let /** @type {{prototype: Document, __new: ?}} */ useBuiltInAsValue = Document;
let /** @type {Document} */ useBuiltInAsType = null;
// Use a user-defined class as both a type and a value.
let /** @type {?} */ useUserClassAsValue = conflict.Class;
let /** @type {conflict.Class} */ useUserClassAsType = null;
// Use a user-defined interface/value pair as both a type and a value.
let /** @type {number} */ useAsValue = conflict.TypeAndValue;
// Note: because of the conflict, we currently just use the type {?} here.
let /** @type {?} */ useAsType = null;
