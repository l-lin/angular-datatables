// This file isn't itself a test case, but it is imported by the
// export.in.ts test case.
export {export4} from './export_helper_2';
export let /** @type {number} */ export1 = 3;
export let /** @type {number} */ export2 = 3;
/** @record */
export function Bar() {}
 /** @type {number} */
Bar.prototype.barField;


export interface Bar { barField: number; }
export var /** @type {Bar} */ export3: Bar = null;

export let /** @type {number} */ export5 = 3;
