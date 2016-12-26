// Ensure we still understand what Array is, even when it has been
// monkeypatched -- issue #170.
interface Array<T> {
  monkeyPatch: boolean;
}

let typeAny: any;
let typeArr: Array<any> = null;
let typeArr2: any[] = null;
let typeNestedArr: {a:any}[][] = null;
let typeObject: {a:number, b:string} = {a:3, b:'b'};
let typeObject2: {[key:string]: number} = null;
let typeObject3: {a:number, [key:string]: number} = null;
let typeObjectEmpty: {} = null;

let typeUnion: string|boolean = Math.random() > 0.5 ? false : '';
let typeUnion2: (string|boolean) = Math.random() > 0.5 ? false : '';
let typeOptionalField: {optional?: boolean} = {};
let typeOptionalUnion: {optional?: string|boolean} = {};

let typeFunc: () => void = function() {};
let typeFunc2: (a: number, b: any) => string = function(a, b) { return ''; };
let typeFunc3: (x: number, callback: (x: number) => string) => string = function(x, cb) { return ''; }
// TODO: let typeFunc4: (a: number, ...args: number[]) => void;

function typeCallback(callback: (val: number) => number) { }
typeCallback(val => val + 1);
function typeGenericCallback<T>(callback: (val: T) => T) { }
typeGenericCallback(val => val);
