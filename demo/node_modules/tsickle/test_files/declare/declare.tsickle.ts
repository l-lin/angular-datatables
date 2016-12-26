Warning at test_files/declare/declare.ts:46:3: multiple constructor signatures in declarations
====
declare namespace DeclareTestModule {
  namespace inner {
    var someBool: boolean;
  }

  interface Foo {
    field: string;
    method(a: string): number;
  }

  class Clazz {
    constructor(a: number);
    /** Comment */
    method(a: string): number;
  }

  interface NotYetHandled {
    [key: string]: string;
  }

  enum Enumeration {
    Value1 = 2,
    Value3
  }
}

// This module is quoted, so it shouldn't show up in externs.js.
declare module "DeclareTestQuotedModule" {
  var foo: string;
}

declare var declareGlobalVar: number;
declare function declareGlobalFunction(x: string): number;

declare interface DeclareTestInterface {
  foo: string;
}

// Should be omitted from externs -- conflicts with Closure.
declare var global: any;
declare interface exports {}

// A class with an overloaded constructor.
declare class MultipleConstructors {
  constructor();
  constructor(a: number);
}

// Add to an existing interface; we shouldn't redeclare Object
// itself, but we still should declare the method.
declare interface Object {
  myMethod();
}
