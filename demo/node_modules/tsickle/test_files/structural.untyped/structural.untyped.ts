// Ensure that a class is structurally equivalent to an object literal
// with the same fields.
class StructuralTest {
  field1: string;
  method(): string { return this.field1; }
}

// The function expects a StructuralTest, but we pass it an object
// literal.
function expectsAStructuralTest(st: StructuralTest) {}
expectsAStructuralTest({field1: 'hi', method: () => 'hi'});
