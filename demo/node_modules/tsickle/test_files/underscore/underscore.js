goog.module('test_files.underscore.underscore');var module = module || {id: 'test_files/underscore/underscore.js'};// Verify that double-underscored names in various places don't get corrupted.
// See getIdentifierText() in tsickle.ts.

var export_underscore_1 = goog.require('test_files.underscore.export_underscore');
exports.__test = export_underscore_1.__test;
let /** @type {number} */ __foo = 3;
exports.__bar = __foo;
class __Class {
    /**
     * @param {string} __arg is __underscored
     * @return {string}
     */
    __method(__arg) {
        return this.__member;
    }
    static _tsickle_typeAnnotationsHelper() {
        /** @type {string} */
        __Class.prototype.__member;
    }
}
/** @record */
function __Interface() { }
