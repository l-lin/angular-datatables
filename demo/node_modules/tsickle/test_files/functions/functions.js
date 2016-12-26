goog.module('test_files.functions.functions');var module = module || {id: 'test_files/functions/functions.js'};/**
 * @param {number} a
 * @return {number}
 */
function Test1(a) {
    return a;
}
/**
 * @param {number} a
 * @param {number} b
 * @return {void}
 */
function Test2(a, b) { }
/**
 * @ngInject
 * @param {number} a
 * @param {number} b
 * @return {void}
 */
function Test3(a, b) { }
/**
 * @param {?} a
 * @return {string}
 */
function Test4(a) {
    return "a";
}
/**
 * @param {!{a: number, b: number}} __0
 * @return {void}
 */
function Destructuring({ a, b }) { }
/**
 * @param {!Array<number>} __0
 * @param {!Array<!Array<string>>} __1
 * @return {void}
 */
function Destructuring2([a, b], [[c]]) { }
/**
 * @param {!Array<?, ?>} __0
 * @param {!Array<!Array<?>>} __1
 * @return {void}
 */
function Destructuring3([a, b], [[c]]) { }
Destructuring({ a: 1, b: 2 });
Destructuring2([1, 2], [['a']]);
Destructuring3([1, 2], [['a']]);
/**
 * @param {...number} a
 * @return {void}
 */
function TestSplat(...a) { }
/**
 * @param {...number} a
 * @return {void}
 */
function TestSplat2(...a) { }
/**
 * @param {...?} a
 * @return {void}
 */
function TestSplat3(...a) { }
TestSplat(1, 2);
TestSplat2(1, 2);
TestSplat3(1, 2);
