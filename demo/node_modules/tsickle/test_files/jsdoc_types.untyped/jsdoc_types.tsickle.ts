/**
 * This test tests importing a type across module boundaries,
 * ensuring that the type gets the proper name in JSDoc comments.
 */

import * as module1 from './module1';
import {ClassOne, value} from './module2';
import {ClassOne as RenamedClassOne} from './module2';
import {ClassTwo as RenamedClassTwo} from './module2';
import {Interface} from './module2';
import {ClassWithParams} from './module2';
import DefaultClass from './default';
import {NeverTyped} from './nevertyped';

// Check that imported types get the proper names in JSDoc.
let /** @type {?} */ useNamespacedClass = new module1.Class();
let /** @type {?} */ useNamespacedClassAsType: module1.Class = null;
let /** @type {?} */ useNamespacedType: module1.Interface = null;

// Should be references to the symbols in module2, perhaps via locals.
let /** @type {?} */ useLocalClass = new ClassOne();
let /** @type {?} */ useLocalClassRenamed = new RenamedClassOne();
let /** @type {?} */ useLocalClassRenamedTwo = new RenamedClassTwo();
let /** @type {?} */ useLocalClassAsTypeRenamed: RenamedClassOne = null;
let /** @type {?} */ useLocalInterface: Interface = null;
let /** @type {?} */ useClassWithParams: ClassWithParams<number> = null;

// This is purely a value; it doesn't need renaming.
let /** @type {?} */ useLocalValue = value;

// Check a default import.
let /** @type {?} */ useDefaultClass = new DefaultClass();
let /** @type {?} */ useDefaultClassAsType: DefaultClass = null;

// NeverTyped should be {?}, even in typed mode.
let /** @type {?} */ useNeverTyped: NeverTyped = null;
let /** @type {?} */ useNeverTyped2: string|NeverTyped = null;
