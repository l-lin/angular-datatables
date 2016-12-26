// TypeAndValue is both a type and a value, which is allowed in TypeScript
// but disallowed in Closure.
export interface TypeAndValue { z: number }
export var /** @type {number} */ TypeAndValue = 3;

export class Class { z: number

  static _tsickle_typeAnnotationsHelper() {
 /** @type {number} */
Class.prototype.z;
  }
 }