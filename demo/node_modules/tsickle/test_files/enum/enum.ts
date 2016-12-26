// Line with a missing semicolon should not break the following enum.
const EnumTestMissingSemi = []
enum EnumTest1 {XYZ, PI = 3.14159}

// Tsickle rewrites the above "enum" declaration into just a plain
// number.  Verify that the resulting TypeScript still allows you to
// index into the enum with all the various ways allowed of enums.
let enumTestValue: EnumTest1 = EnumTest1.XYZ;
let enumTestValue2: EnumTest1 = EnumTest1['XYZ'];
let enumNumIndex: string = EnumTest1[null as number];
let enumStrIndex: number = EnumTest1[null as string];

function enumTestFunction(val: EnumTest1) {}
enumTestFunction(enumTestValue);

let enumTestLookup = EnumTest1["XYZ"];

// This additional exported enum is here to exercise the fix for issue #51.
export enum EnumTest2 {XYZ, PI = 3.14159}

// Repro for #97
enum ComponentIndex {
  Scheme = 1,
  UserInfo,
  Domain = 0,  // Be sure to exercise the code with a 0 enum value.
  UserInfo2 = UserInfo,
}

// const enums not have any Closure output, as they are purely compile-time.
const enum EnumTestDisappears {
  ShouldNotHaveAnyTsickleOutput,
}
let enumTestDisappears = EnumTestDisappears.ShouldNotHaveAnyTsickleOutput;

// One place where enums with non-constant values make sense is when
// you are exporting a Closure value into a TypeScript namespace:
//   import Foo from 'goog:bar.baz';
//   export enum MyEnum { MyFoo = Foo }
// However, just immediately evaluating an arrow expression as done here
// is sufficient to trigger the non-constant value code path that we're
// testing with this block.
enum EnumWithNonConstValues {
  Scheme = (x => x + 1)(3),
  UserInfoRenamed = ComponentIndex.UserInfo,
}
