interface Point {
  x: number;
  y: number;
}

function usePoint(p: Point): number {
  return p.x + p.y;
}

let p: Point = {x:1, y:1};
usePoint(p);
usePoint({x:1, y:1});

/*
TODO: this example crashes the compiler -- I've mailed the team about it.
interface Point3 extends Point {
  z: number;
}
let p3: Point3 = {x:1, y:1, z:1};
usePoint(p3);
*/

// Check some harder interface types.
interface TrickyInterface {
  [offset: number]: number;
  'foo': number;
  (x: number): /* yuck */
    number;
  // TODO: handle optional members.  Should have |undefined type.
  'foobar'?: 'true'|'false';
}
