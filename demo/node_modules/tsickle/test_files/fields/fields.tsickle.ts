Warning at test_files/fields/fields.ts:22:5: unhandled anonymous type
====
class FieldsTest {
  field1: string;
  field2: number;
/**
 * @param {number} field3
 */
constructor(private field3: number) {
    this.field3 = 2 + 1;
  }

  // A field without an explicit type declaration.
  field4 = 'string';
/**
 * @return {string}
 */
getF1() {
    // This access prints a warning without a generated field stub declaration.
    return this.field1;
  }

  static _tsickle_typeAnnotationsHelper() {
 /** @type {string} */
FieldsTest.prototype.field1;
 /** @type {number} */
FieldsTest.prototype.field2;
 /** @type {string} */
FieldsTest.prototype.field4;
 /** @type {number} */
FieldsTest.prototype.field3;
  }

}

let /** @type {FieldsTest} */ fieldsTest = new FieldsTest(3);
// Ensure the type is understood by Closure.
fieldsTest.field1 = 'hi';

let /** @type {?} */ AnonymousClass = class {
  field: number;
}