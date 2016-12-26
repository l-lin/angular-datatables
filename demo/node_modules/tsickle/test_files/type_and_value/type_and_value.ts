import * as conflict from './module';

// This test deals with symbols that are simultaneously types and values.

// Use a browser built-in as both a type and a value.
let useBuiltInAsValue = Document;
let useBuiltInAsType: Document = null;

// Use a user-defined class as both a type and a value.
let useUserClassAsValue = conflict.Class;
let useUserClassAsType: conflict.Class = null;

// Use a user-defined interface/value pair as both a type and a value.
let useAsValue = conflict.TypeAndValue;
// Note: because of the conflict, we currently just use the type {?} here.
let useAsType: conflict.TypeAndValue = null;
