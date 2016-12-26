// Line with a missing semicolon should not break the following enum.
const /** @type {Array<?>} */ EnumTestMissingSemi = []
type EnumTest1 = number;
let EnumTest1: any = {};
/** @type {number} */
EnumTest1.XYZ = 0;
/** @type {number} */
EnumTest1.PI = 3.14159;
EnumTest1[EnumTest1.XYZ] = "XYZ";
EnumTest1[EnumTest1.PI] = "PI";


// Tsickle rewrites the above "enum" declaration into just a plain
// number.  Verify that the resulting TypeScript still allows you to
// index into the enum with all the various ways allowed of enums.
let /** @type {number} */ enumTestValue: EnumTest1 = EnumTest1.XYZ;
let /** @type {number} */ enumTestValue2: EnumTest1 = EnumTest1['XYZ'];
let /** @type {string} */ enumNumIndex: string = EnumTest1[ /** @type {number} */((null as number))];
let /** @type {number} */ enumStrIndex: number = EnumTest1[ /** @type {string} */((null as string))];
/**
 * @param {number} val
 * @return {void}
 */
function enumTestFunction(val: EnumTest1) {}
enumTestFunction(enumTestValue);

let /** @type {number} */ enumTestLookup = EnumTest1["XYZ"];
export type EnumTest2 = number;
export let EnumTest2: any = {};
/** @type {number} */
EnumTest2.XYZ = 0;
/** @type {number} */
EnumTest2.PI = 3.14159;
EnumTest2[EnumTest2.XYZ] = "XYZ";
EnumTest2[EnumTest2.PI] = "PI";

type ComponentIndex = number;
let ComponentIndex: any = {};
/** @type {number} */
ComponentIndex.Scheme = 1;
/** @type {number} */
ComponentIndex.UserInfo = 2;
/** @type {number} */
ComponentIndex.Domain = 0;
/** @type {number} */
ComponentIndex.UserInfo2 = 2;
ComponentIndex[ComponentIndex.Scheme] = "Scheme";
ComponentIndex[ComponentIndex.UserInfo] = "UserInfo";
ComponentIndex[ComponentIndex.Domain] = "Domain";
ComponentIndex[ComponentIndex.UserInfo2] = "UserInfo2";


// const enums not have any Closure output, as they are purely compile-time.
const enum EnumTestDisappears {
  ShouldNotHaveAnyTsickleOutput,
}
let /** @type {number} */ enumTestDisappears = EnumTestDisappears.ShouldNotHaveAnyTsickleOutput;
type EnumWithNonConstValues = number;
let EnumWithNonConstValues: any = {};
/** @type {number} */
EnumWithNonConstValues.Scheme =  (x => x + 1)(3);
/** @type {number} */
EnumWithNonConstValues.UserInfoRenamed = 2;
EnumWithNonConstValues[EnumWithNonConstValues.Scheme] = "Scheme";
EnumWithNonConstValues[EnumWithNonConstValues.UserInfoRenamed] = "UserInfoRenamed";

