goog.module('test_files.type.type');var module = module || {id: 'test_files/type/type.js'};let /** @type {?} */ typeAny;
let /** @type {Array<?>} */ typeArr = null;
let /** @type {Array<?>} */ typeArr2 = null;
let /** @type {Array<Array<{a: ?}>>} */ typeNestedArr = null;
let /** @type {{a: number, b: string}} */ typeObject = { a: 3, b: 'b' };
let /** @type {Object<string,number>} */ typeObject2 = null;
let /** @type {?} */ typeObject3 = null;
let /** @type {Object} */ typeObjectEmpty = null;
let /** @type {(string|boolean)} */ typeUnion = Math.random() > 0.5 ? false : '';
let /** @type {(string|boolean)} */ typeUnion2 = Math.random() > 0.5 ? false : '';
let /** @type {{optional: (boolean|undefined)}} */ typeOptionalField = {};
let /** @type {{optional: ((string|boolean)|undefined)}} */ typeOptionalUnion = {};
let /** @type {function(): void} */ typeFunc = function () { };
let /** @type {function(number, ?): string} */ typeFunc2 = function (a, b) { return ''; };
let /** @type {function(number, function(number): string): string} */ typeFunc3 = function (x, cb) { return ''; };
/**
 * @param {function(number): number} callback
 * @return {void}
 */
function typeCallback(callback) { }
typeCallback(val => val + 1);
/**
 * @param {function(?): ?} callback
 * @return {void}
 */
function typeGenericCallback(callback) { }
typeGenericCallback(val => val);
