export * from './export_helper';
export * from './export_helper_2';

// These conflict with an export discovered via the above exports,
// so the above export's versions should not show up.
export var export1: string = 'wins';
export {export4 as export3} from './export_helper';

// This local should be fine to export.
export var exportLocal = 3;

// The existence of a local should not prevent "export2" from making
// it to the exports list.  export2 should only show up once in the
// above two "export *" lines, though.
let export2 = 3;

// This is just an import, so export5 should still be included.
import {export5} from './export_helper';
