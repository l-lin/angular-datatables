abstract class Base {
  abstract simple(): void;

  // Verify we drop the "abstract" when it's after a modifier too.
  public abstract publicAbstract(): void;

  // Verify we don't drop parameters.
  public abstract params(x: number[]): void;

  // Verify we properly handle functions without a declared return type.
  abstract noReturnType();

  // Verify we properly handle functions that expect a return value.
  abstract hasReturnType(): number;

  bar() {
    this.simple();
    this.publicAbstract();
    this.params([]);
    this.noReturnType();
    this.hasReturnType();
  }
}

class Derived extends Base {
  // Workaround for https://github.com/google/closure-compiler/issues/1955
  constructor() {
    super();
  }
  simple() {}
  publicAbstract() {}
  params(x: number[]): void { }
  noReturnType() {}
  hasReturnType(): number { return 3; }
}

let x: Base = new Derived();
