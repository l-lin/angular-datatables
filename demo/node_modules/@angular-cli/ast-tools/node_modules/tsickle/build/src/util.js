/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
// toArray is a temporary function to help in the use of
// ES6 maps and sets when running on node 4, which doesn't
// support Iterators completely.
function toArray(iterator) {
    var array = [];
    while (true) {
        var ir = iterator.next();
        if (ir.done) {
            break;
        }
        array.push(ir.value);
    }
    return array;
}
exports.toArray = toArray;

//# sourceMappingURL=util.js.map
