goog.module('test_files.jsdoc_types.untyped.jsdoc_types');var module = module || {id: 'test_files/jsdoc_types.untyped/jsdoc_types.js'};/**
 * This test tests importing a type across module boundaries,
 * ensuring that the type gets the proper name in JSDoc comments.
 */

var module1 = goog.require('test_files.jsdoc_types.untyped.module1');
var module2_1 = goog.require('test_files.jsdoc_types.untyped.module2');
var module2_2 = module2_1;
var module2_3 = module2_1;
var default_1 = goog.require('test_files.jsdoc_types.untyped.default');
// Check that imported types get the proper names in JSDoc.
let /** @type {?} */ useNamespacedClass = new module1.Class();
let /** @type {?} */ useNamespacedClassAsType = null;
let /** @type {?} */ useNamespacedType = null;
// Should be references to the symbols in module2, perhaps via locals.
let /** @type {?} */ useLocalClass = new module2_1.ClassOne();
let /** @type {?} */ useLocalClassRenamed = new module2_2.ClassOne();
let /** @type {?} */ useLocalClassRenamedTwo = new module2_3.ClassTwo();
let /** @type {?} */ useLocalClassAsTypeRenamed = null;
let /** @type {?} */ useLocalInterface = null;
let /** @type {?} */ useClassWithParams = null;
// This is purely a value; it doesn't need renaming.
let /** @type {?} */ useLocalValue = module2_1.value;
// Check a default import.
let /** @type {?} */ useDefaultClass = new default_1.default();
let /** @type {?} */ useDefaultClassAsType = null;
// NeverTyped should be {?}, even in typed mode.
let /** @type {?} */ useNeverTyped = null;
let /** @type {?} */ useNeverTyped2 = null;
