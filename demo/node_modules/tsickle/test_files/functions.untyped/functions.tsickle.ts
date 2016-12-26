
/**
 * @param {?} a
 * @return {?}
 */
function Test1(a: number) {
  return a;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function Test2(a: number, b: number) {}
/**
 * @ngInject
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function Test3(a: number, b: number) {}

// Test overloaded functions.
function Test4(a: number): string;
/**
 * @param {?} a
 * @return {?}
 */
function Test4(a: any): string {
  return "a";
}
/**
 * @param {?} __0
 * @return {?}
 */
function Destructuring({a, b}: {a: number, b: number}) {}
/**
 * @param {?} __0
 * @param {?} __1
 * @return {?}
 */
function Destructuring2([a, b]: number[], [[c]]: string[][]) {}
/**
 * @param {?} __0
 * @param {?} __1
 * @return {?}
 */
function Destructuring3([a, b], [[c]]) {}
Destructuring({a:1, b:2});
Destructuring2([1, 2], [['a']]);
Destructuring3([1, 2], [['a']]);
/**
 * @param {...?} a
 * @return {?}
 */
function TestSplat(...a: number[]) {}
/**
 * @param {...?} a
 * @return {?}
 */
function TestSplat2(...a: Array<number>) {}
/**
 * @param {...?} a
 * @return {?}
 */
function TestSplat3(...a) {}
TestSplat(1, 2);
TestSplat2(1, 2);
TestSplat3(1, 2);
