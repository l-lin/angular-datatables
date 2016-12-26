goog.module('test_files.fields.fields');var module = module || {id: 'test_files/fields/fields.js'};class FieldsTest {
    /**
     * @param {number} field3
     */
    constructor(field3) {
        this.field3 = field3;
        // A field without an explicit type declaration.
        this.field4 = 'string';
        this.field3 = 2 + 1;
    }
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
}
;
