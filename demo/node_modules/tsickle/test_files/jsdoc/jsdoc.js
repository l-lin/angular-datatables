goog.module('test_files.jsdoc.jsdoc');var module = module || {id: 'test_files/jsdoc/jsdoc.js'};/**
 * @param {string} foo a string.
 * @param {string} baz
 * @return {string} return comment.
 */
function jsDocTestFunction(foo, baz) {
    return foo;
}
/**
 * @return {string} return comment in a "@returns" block.
 */
function returnsTest() {
    return 'abc';
}
/**
 * @param {string} foo
 * @return {void}
 */
function jsDocTestBadDoc(foo) { }
class JSDocTest {
    static _tsickle_typeAnnotationsHelper() {
        /** @export
        @type {string} */
        JSDocTest.prototype.exported;
        /** @type {string} */
        JSDocTest.prototype.badExport;
        /** @type {string} */
        JSDocTest.prototype.stringWithoutJSDoc;
        /** @type {number} */
        JSDocTest.prototype.typedThing;
    }
}
/**
 * @see This tag will be kept, because Closure allows it.
 * @return {void}
 */
function x() { }
;
