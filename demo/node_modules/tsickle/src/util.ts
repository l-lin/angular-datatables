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
