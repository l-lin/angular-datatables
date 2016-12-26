Warning at test_files/type/type.ts:13:5: unhandled type literal
Warning at test_files/type/type.ts:28:1: unhandled type {type flags:0x4000 TypeParameter symbol.name:"T"}
Warning at test_files/type/type.ts:28:1: unhandled type {type flags:0x4000 TypeParameter symbol.name:"T"}
====
// Ensure we still understand what Array is, even when it has been
// monkeypatched -- issue #170.
interface Array<T> {
  monkeyPatch: boolean;
}

let /** @type {?} */ typeAny: any;
let /** @type {Array<?>} */ typeArr: Array<any> = null;
let /** @type {Array<?>} */ typeArr2: any[] = null;
let /** @type {Array<Array<{a: ?}>>} */ typeNestedArr: {a:any}[][] = null;
let /** @type {{a: number, b: string}} */ typeObject: {a:number, b:string} = {a:3, b:'b'};
let /** @type {Object<string,number>} */ typeObject2: {[key:string]: number} = null;
let /** @type {?} */ typeObject3: {a:number, [key:string]: number} = null;
let /** @type {Object} */ typeObjectEmpty: {} = null;

let /** @type {(string|boolean)} */ typeUnion: string|boolean = Math.random() > 0.5 ? false : '';
let /** @type {(string|boolean)} */ typeUnion2: (string|boolean) = Math.random() > 0.5 ? false : '';
let /** @type {{optional: (boolean|undefined)}} */ typeOptionalField: {optional?: boolean} = {};
let /** @type {{optional: ((string|boolean)|undefined)}} */ typeOptionalUnion: {optional?: string|boolean} = {};

let /** @type {function(): void} */ typeFunc: () => void = function() {};
let /** @type {function(number, ?): string} */ typeFunc2: (a: number, b: any) => string = function(a, b) { return ''; };
let /** @type {function(number, function(number): string): string} */ typeFunc3: (x: number, callback: (x: number) => string) => string = function(x, cb) { return ''; }
/**
 * @param {function(number): number} callback
 * @return {void}
 */
function typeCallback(callback: (val: number) => number) { }
typeCallback(val => val + 1);
/**
 * @param {function(?): ?} callback
 * @return {void}
 */
function typeGenericCallback<T>(callback: (val: T) => T) { }
typeGenericCallback(val => val);
