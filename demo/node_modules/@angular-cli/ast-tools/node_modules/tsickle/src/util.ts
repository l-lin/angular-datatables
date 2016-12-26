/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// toArray is a temporary function to help in the use of
// ES6 maps and sets when running on node 4, which doesn't
// support Iterators completely.

export function toArray<T>(iterator: Iterator<T>): T[] {
  const array: T[] = [];
  while (true) {
    const ir = iterator.next();
    if (ir.done) {
      break;
    }
    array.push(ir.value!);
  }
  return array;
}
