type MyType = number;
/** @typedef {number} */
var MyType: void;

var /** @type {number} */ y: MyType = 3;

type Recursive = {value: number, next: Recursive};
/** @typedef {{value: number, next: ?}} */
var Recursive: void;


export type ExportedType = string;
/** @typedef {string} */
export var ExportedType: void;
