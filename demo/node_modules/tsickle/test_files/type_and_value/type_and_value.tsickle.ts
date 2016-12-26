Warning at test_files/type_and_value/type_and_value.ts:10:5: unhandled anonymous type
Warning at test_files/type_and_value/type_and_value.ts:16:5: type/symbol conflict for TypeAndValue, using {?} for now
====
import * as conflict from './module';

// This test deals with symbols that are simultaneously types and values.

// Use a browser built-in as both a type and a value.
let /** @type {{prototype: Document, __new: ?}} */ useBuiltInAsValue = Document;
let /** @type {Document} */ useBuiltInAsType: Document = null;

// Use a user-defined class as both a type and a value.
let /** @type {?} */ useUserClassAsValue = conflict.Class;
let /** @type {conflict.Class} */ useUserClassAsType: conflict.Class = null;

// Use a user-defined interface/value pair as both a type and a value.
let /** @type {number} */ useAsValue = conflict.TypeAndValue;
// Note: because of the conflict, we currently just use the type {?} here.
let /** @type {?} */ useAsType: conflict.TypeAndValue = null;
