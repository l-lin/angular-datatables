class Comments {
  /** @export */
  export1: string;
  // Note: the below @export doesn't make it into the output because it
  // it isn't in a JSDoc comment.
  /// @export
  export2: string;
  /* non js-doc comment */
  nodoc1: number;
  // non js-doc comment
  nodoc2: number;
  /// non js-doc comment
  nodoc3: number;
  /** inline jsdoc comment without type annotation */
  jsdoc1: number;
  /**
   * multi-line jsdoc comment without
   * type annotation.
   */
  jsdoc2: number;

  static _tsickle_typeAnnotationsHelper() {
 /** @export
 @type {string} */
Comments.prototype.export1;
 /** @type {string} */
Comments.prototype.export2;
 /** @type {number} */
Comments.prototype.nodoc1;
 /** @type {number} */
Comments.prototype.nodoc2;
 /** @type {number} */
Comments.prototype.nodoc3;
 /** inline jsdoc comment without type annotation
 @type {number} */
Comments.prototype.jsdoc1;
 /** multi-line jsdoc comment without type annotation.
 @type {number} */
Comments.prototype.jsdoc2;
  }

}
