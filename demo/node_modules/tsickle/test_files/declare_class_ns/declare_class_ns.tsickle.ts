declare class ClassAndNamespace {
  classFunction(x: string): void;
}
declare namespace ClassAndNamespace {
  var bar: number;
}
declare namespace ClassAndNamespace {
  var baz: number;
  function namespaceFunction(x: number): string;
}
