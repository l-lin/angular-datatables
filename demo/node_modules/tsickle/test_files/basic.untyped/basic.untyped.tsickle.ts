
/**
 * @param {?} arg1
 * @return {?}
 */
function func(arg1: string): number[] {
  return [3];
}

class Foo {
  field: string;
/**
 * @param {?} ctorArg
 */
constructor(private ctorArg: string) {
    this.field = 'hello';
  }

  static _tsickle_typeAnnotationsHelper() {
 /** @type {?} */
Foo.prototype.field;
 /** @type {?} */
Foo.prototype.ctorArg;
  }

}

// These two declarations should not have a @type annotation,
// regardless of untyped.
(function() {
  // With a type annotation:
  let {a, b}: {a:string, b:number} = {a:null, b:null};
})();
(function() {
  // Without a type annotation:
  let {a, b} = {a:null, b:null};
})();
