// Verify that double-underscored names in various places don't get corrupted.
// See getIdentifierText() in tsickle.ts.

export * from './export_underscore';

let __foo = 3;
export {__foo as __bar};
class __Class {
  __member: string;

  /**
   * @param __arg is __underscored
   */
  __method(__arg: string): string {
    return this.__member;
  }
}
interface __Interface {}

declare namespace __NS {
  let __ns1: number;
}
