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
}
