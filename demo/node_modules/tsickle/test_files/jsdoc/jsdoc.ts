/**
 * @param foo a string.
 * @return return comment.
 */
function jsDocTestFunction(foo: string, baz: string): string {
  return foo;
}

/**
 * @returns return comment in a "@returns" block.
 */
function returnsTest(): string {
  return 'abc';
}

/**
 * @param {badTypeHere} foo no types allowed.
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
}

/**
 * @madeUptag This tag will be stripped, because Closure disallows it.
 * @see This tag will be kept, because Closure allows it.
 */
function x() {};