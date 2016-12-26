abstract class Base {
/**
 * @abstract
 * @return {void}
 */
simple() {}
/**
 * @abstract
 * @return {void}
 */
publicAbstract() {}
/**
 * @abstract
 * @param {Array<number>} x
 * @return {void}
 */
params(x: number[]) {}
/**
 * @abstract
 * @return {?}
 */
noReturnType() {}
/**
 * @abstract
 * @return {number}
 */
hasReturnType() {}
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
simple() {}
/**
 * @return {void}
 */
publicAbstract() {}
/**
 * @param {Array<number>} x
 * @return {void}
 */
params(x: number[]): void { }
/**
 * @return {void}
 */
noReturnType() {}
/**
 * @return {number}
 */
hasReturnType(): number { return 3; }
}

let /** @type {Base} */ x: Base = new Derived();
