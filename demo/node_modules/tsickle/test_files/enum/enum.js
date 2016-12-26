goog.module('test_files.enum.enum');var module = module || {id: 'test_files/enum/enum.js'};
// Line with a missing semicolon should not break the following enum.
const /** @type {Array<?>} */ EnumTestMissingSemi = [];
let EnumTest1 = {};
/** @type {number} */
EnumTest1.XYZ = 0;
/** @type {number} */
EnumTest1.PI = 3.14159;
EnumTest1[EnumTest1.XYZ] = "XYZ";
EnumTest1[EnumTest1.PI] = "PI";
// Tsickle rewrites the above "enum" declaration into just a plain
// number.  Verify that the resulting TypeScript still allows you to
// index into the enum with all the various ways allowed of enums.
let /** @type {number} */ enumTestValue = EnumTest1.XYZ;
let /** @type {number} */ enumTestValue2 = EnumTest1['XYZ'];
let /** @type {string} */ enumNumIndex = EnumTest1[(null)];
let /** @type {number} */ enumStrIndex = EnumTest1[(null)];
/**
 * @param {number} val
 * @return {void}
 */
function enumTestFunction(val) { }
enumTestFunction(enumTestValue);
let /** @type {number} */ enumTestLookup = EnumTest1["XYZ"];
exports.EnumTest2 = {};
/** @type {number} */
exports.EnumTest2.XYZ = 0;
/** @type {number} */
exports.EnumTest2.PI = 3.14159;
exports.EnumTest2[exports.EnumTest2.XYZ] = "XYZ";
exports.EnumTest2[exports.EnumTest2.PI] = "PI";
let ComponentIndex = {};
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
let /** @type {number} */ enumTestDisappears = 0 /* ShouldNotHaveAnyTsickleOutput */;
let EnumWithNonConstValues = {};
/** @type {number} */
EnumWithNonConstValues.Scheme = (x => x + 1)(3);
/** @type {number} */
EnumWithNonConstValues.UserInfoRenamed = 2;
EnumWithNonConstValues[EnumWithNonConstValues.Scheme] = "Scheme";
EnumWithNonConstValues[EnumWithNonConstValues.UserInfoRenamed] = "UserInfoRenamed";
