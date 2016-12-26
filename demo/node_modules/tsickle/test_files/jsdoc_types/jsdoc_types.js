goog.module('test_files.jsdoc_types.jsdoc_types');var module = module || {id: 'test_files/jsdoc_types/jsdoc_types.js'};/**
 * This test tests importing a type across module boundaries,
 * ensuring that the type gets the proper name in JSDoc comments.
 */

var module1 = goog.require('test_files.jsdoc_types.module1');
var module2_1 = goog.require('test_files.jsdoc_types.module2');
const ClassOne = module2_1.ClassOne; /* local alias for Closure JSDoc */
const value = module2_1.value; /* local alias for Closure JSDoc */
var module2_2 = module2_1;
const RenamedClassOne = module2_2.ClassOne; /* local alias for Closure JSDoc */
var module2_3 = module2_1;
const RenamedClassTwo = module2_3.ClassTwo; /* local alias for Closure JSDoc */
var module2_4 = module2_1;
const Interface = module2_4.Interface; /* local alias for Closure JSDoc */
var module2_5 = module2_1;
const ClassWithParams = module2_5.ClassWithParams; /* local alias for Closure JSDoc */
var default_1 = goog.require('test_files.jsdoc_types.default');
const DefaultClass = default_1.default; /* local alias for Closure JSDoc */
var nevertyped_1 = goog.require('test_files.jsdoc_types.nevertyped');
const NeverTyped = nevertyped_1.NeverTyped; /* local alias for Closure JSDoc */
// Check that imported types get the proper names in JSDoc.
let /** @type {module1.Class} */ useNamespacedClass = new module1.Class();
let /** @type {module1.Class} */ useNamespacedClassAsType = null;
let /** @type {module1.Interface} */ useNamespacedType = null;
// Should be references to the symbols in module2, perhaps via locals.
let /** @type {ClassOne} */ useLocalClass = new module2_1.ClassOne();
let /** @type {ClassOne} */ useLocalClassRenamed = new module2_2.ClassOne();
let /** @type {RenamedClassTwo} */ useLocalClassRenamedTwo = new module2_3.ClassTwo();
let /** @type {ClassOne} */ useLocalClassAsTypeRenamed = null;
let /** @type {Interface} */ useLocalInterface = null;
let /** @type {ClassWithParams<number>} */ useClassWithParams = null;
// This is purely a value; it doesn't need renaming.
let /** @type {number} */ useLocalValue = module2_1.value;
// Check a default import.
let /** @type {DefaultClass} */ useDefaultClass = new default_1.default();
let /** @type {DefaultClass} */ useDefaultClassAsType = null;
// NeverTyped should be {?}, even in typed mode.
let /** @type {?} */ useNeverTyped = null;
let /** @type {(string|?)} */ useNeverTyped2 = null;
