goog.module('test_files.interface.interface');var module = module || {id: 'test_files/interface/interface.js'};/** @record */
function Point() { }
/** @type {number} */
Point.prototype.x;
/** @type {number} */
Point.prototype.y;
/**
 * @param {Point} p
 * @return {number}
 */
function usePoint(p) {
    return p.x + p.y;
}
let /** @type {Point} */ p = { x: 1, y: 1 };
usePoint(p);
usePoint({ x: 1, y: 1 });
/** @record */
function TrickyInterface() { }
/* TODO: handle strange member:
[offset: number]: number;
*/
/** @type {number} */
TrickyInterface.prototype.foo;
/* TODO: handle strange member:
(x: number): __ yuck __
    number;
*/
/** @type {string} */
TrickyInterface.prototype.foobar;
