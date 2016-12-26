// Verify that double-underscored names in various places don't get corrupted.
// See getIdentifierText() in tsickle.ts.

export {__test} from './export_underscore';

let /** @type {number} */ __foo = 3;
export {__foo as __bar};
class __Class {
  __member: string;
/**
 * @param {string} __arg is __underscored
 * @return {string}
 */
__method(__arg: string): string {
    return this.__member;
  }

  static _tsickle_typeAnnotationsHelper() {
 /** @type {string} */
__Class.prototype.__member;
  }

}
/** @record */
function __Interface() {}

interface __Interface {}

declare namespace __NS {
  let __ns1: number;
}
