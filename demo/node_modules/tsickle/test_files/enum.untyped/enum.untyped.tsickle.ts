
type EnumUntypedTest1 = number;
let EnumUntypedTest1: any = {};
EnumUntypedTest1.XYZ = 0;
EnumUntypedTest1.PI = 3.14159;
EnumUntypedTest1[EnumUntypedTest1.XYZ] = "XYZ";
EnumUntypedTest1[EnumUntypedTest1.PI] = "PI";

export type EnumUntypedTest2 = number;
export let EnumUntypedTest2: any = {};
EnumUntypedTest2.XYZ = 0;
EnumUntypedTest2.PI = 3.14159;
EnumUntypedTest2[EnumUntypedTest2.XYZ] = "XYZ";
EnumUntypedTest2[EnumUntypedTest2.PI] = "PI";

