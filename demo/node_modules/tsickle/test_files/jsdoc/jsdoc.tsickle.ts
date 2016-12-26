Warning at test_files/jsdoc/jsdoc.ts:16:1: type annotations (using {...}) are redundant with TypeScript types
Warning at test_files/jsdoc/jsdoc.ts:25:3: type annotations (using {...}) are redundant with TypeScript types
Warning at test_files/jsdoc/jsdoc.ts:30:3: @type annotations are redundant with TypeScript equivalents
====

/**
 * @param {string} foo a string.
 * @param {string} baz
 * @return {string} return comment.
 */
function jsDocTestFunction(foo: string, baz: string): string {
  return foo;
}
/**
 * @return {string} return comment in a "@returns" block.
 */
function returnsTest(): string {
  return 'abc';
}
/**
 * @param {string} foo
 * @return {void}
 */
function jsDocTestBadDoc(foo: string) {}

class JSDocTest {
  /** @export */
  exported: string;

  /** @export {number} */
  badExport: string;

  stringWithoutJSDoc: string;

  /** @type {badType} */
  typedThing: number;

  static _tsickle_typeAnnotationsHelper() {
 /** @export
 @type {string} */
JSDocTest.prototype.exported;
 /** @type {string} */
JSDocTest.prototype.badExport;
 /** @type {string} */
JSDocTest.prototype.stringWithoutJSDoc;
 /** @type {number} */
JSDocTest.prototype.typedThing;
  }

}
/**
 * @see This tag will be kept, because Closure allows it.
 * @return {void}
 */
function x() {};