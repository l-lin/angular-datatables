function optionalArgument(x: number, y?: string) {
}
optionalArgument(1);

class OptionalTest {
  constructor(a: string, b?: string) {}
  method(c: string = 'hi') {}
}

let optionalTest = new OptionalTest('a');
optionalTest.method();
