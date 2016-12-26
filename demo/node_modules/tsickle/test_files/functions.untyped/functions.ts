function Test1(a: number) {
  return a;
}

function Test2(a: number, b: number) {}

/** @ngInject */
function Test3(a: number, b: number) {}

// Test overloaded functions.
function Test4(a: number): string;
function Test4(a: any): string {
  return "a";
}

function Destructuring({a, b}: {a: number, b: number}) {}
function Destructuring2([a, b]: number[], [[c]]: string[][]) {}
function Destructuring3([a, b], [[c]]) {}
Destructuring({a:1, b:2});
Destructuring2([1, 2], [['a']]);
Destructuring3([1, 2], [['a']]);

function TestSplat(...a: number[]) {}
function TestSplat2(...a: Array<number>) {}
function TestSplat3(...a) {}
TestSplat(1, 2);
TestSplat2(1, 2);
TestSplat3(1, 2);
