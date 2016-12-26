goog.module('test_files.abstract.abstract');var module = module || {id: 'test_files/abstract/abstract.js'};class Base {
    /**
     * @abstract
     * @return {void}
     */
    simple() { }
    /**
     * @abstract
     * @return {void}
     */
    publicAbstract() { }
    /**
     * @abstract
     * @param {Array<number>} x
     * @return {void}
     */
    params(x) { }
    /**
     * @abstract
     * @return {?}
     */
    noReturnType() { }
    /**
     * @abstract
     * @return {number}
     */
    hasReturnType() { }
    /**
     * @return {void}
     */
    bar() {
        this.simple();
        this.publicAbstract();
        this.params([]);
        this.noReturnType();
        this.hasReturnType();
    }
}
class Derived extends Base {
    /**
     */
    constructor() {
        super();
    }
    /**
     * @return {void}
     */
    simple() { }
    /**
     * @return {void}
     */
    publicAbstract() { }
    /**
     * @param {Array<number>} x
     * @return {void}
     */
    params(x) { }
    /**
     * @return {void}
     */
    noReturnType() { }
    /**
     * @return {number}
     */
    hasReturnType() { return 3; }
}
let /** @type {Base} */ x = new Derived();
