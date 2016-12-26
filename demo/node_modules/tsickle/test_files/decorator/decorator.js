goog.module('test_files.decorator.decorator');var module = module || {id: 'test_files/decorator/decorator.js'};/**
 * @param {Object} a
 * @param {string} b
 * @return {void}
 */
function decorator(a, b) { }
/**
 * @param {Object} a
 * @param {string} b
 * @return {void}
 */
function annotationDecorator(a, b) { }
class DecoratorTest {
    static _tsickle_typeAnnotationsHelper() {
        /** @type {Object<string,Array<DecoratorInvocation>>} */
        DecoratorTest.propDecorators;
        /** @type {number} */
        DecoratorTest.prototype.x;
        /** @type {number} */
        DecoratorTest.prototype.y;
    }
}
DecoratorTest.propDecorators = {
    'y': [{ type: annotationDecorator },],
};
__decorate([
    decorator, 
    __metadata('design:type', Number)
], DecoratorTest.prototype, "x", void 0);
/** @record */
function DecoratorInvocation() { }
/** @type {Function} */
DecoratorInvocation.prototype.type;
/** @type {Array<?>} */
DecoratorInvocation.prototype.args;
