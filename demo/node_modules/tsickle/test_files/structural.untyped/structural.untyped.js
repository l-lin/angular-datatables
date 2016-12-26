goog.module('test_files.structural.untyped.structural.untyped');var module = module || {id: 'test_files/structural.untyped/structural.untyped.js'};// Ensure that a class is structurally equivalent to an object literal
// with the same fields.
class StructuralTest {
    /**
     * @return {?}
     */
    method() { return this.field1; }
    static _tsickle_typeAnnotationsHelper() {
        /** @type {?} */
        StructuralTest.prototype.field1;
    }
}
/**
 * @param {?} st
 * @return {?}
 */
function expectsAStructuralTest(st) { }
expectsAStructuralTest({ field1: 'hi', method: () => 'hi' });
