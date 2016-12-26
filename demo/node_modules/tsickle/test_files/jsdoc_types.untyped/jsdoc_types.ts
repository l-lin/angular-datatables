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
let useNamespacedClass = new module1.Class();
let useNamespacedClassAsType: module1.Class = null;
let useNamespacedType: module1.Interface = null;

// Should be references to the symbols in module2, perhaps via locals.
let useLocalClass = new ClassOne();
let useLocalClassRenamed = new RenamedClassOne();
let useLocalClassRenamedTwo = new RenamedClassTwo();
let useLocalClassAsTypeRenamed: RenamedClassOne = null;
let useLocalInterface: Interface = null;
let useClassWithParams: ClassWithParams<number> = null;

// This is purely a value; it doesn't need renaming.
let useLocalValue = value;

// Check a default import.
let useDefaultClass = new DefaultClass();
let useDefaultClassAsType: DefaultClass = null;

// NeverTyped should be {?}, even in typed mode.
let useNeverTyped: NeverTyped = null;
let useNeverTyped2: string|NeverTyped = null;
