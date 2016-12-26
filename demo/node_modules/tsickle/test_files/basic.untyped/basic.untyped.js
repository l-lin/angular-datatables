goog.module('test_files.basic.untyped.basic.untyped');var module = module || {id: 'test_files/basic.untyped/basic.untyped.js'};/**
 * @param {?} arg1
 * @return {?}
 */
function func(arg1) {
    return [3];
}
class Foo {
    /**
     * @param {?} ctorArg
     */
    constructor(ctorArg) {
        this.ctorArg = ctorArg;
        this.field = 'hello';
    }
    static _tsickle_typeAnnotationsHelper() {
        /** @type {?} */
        Foo.prototype.field;
        /** @type {?} */
        Foo.prototype.ctorArg;
    }
}
// These two declarations should not have a @type annotation,
// regardless of untyped.
(function () {
    // With a type annotation:
    let { a, b } = { a: null, b: null };
})();
(function () {
    // Without a type annotation:
    let { a, b } = { a: null, b: null };
})();
