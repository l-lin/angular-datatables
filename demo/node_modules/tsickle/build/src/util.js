// toArray is a temporary function to help in the use of
// ES6 maps and sets when running on node 4, which doesn't
// support Iterators completely.
"use strict";
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
