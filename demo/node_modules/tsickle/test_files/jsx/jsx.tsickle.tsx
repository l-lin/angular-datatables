// TypeScript compiles JSX into code that uses a special "JSX" module.
// In a React app, this module is provided by the React typings.
// For this test, just declare enough to make the code typecheck.
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    div: any;
    "var": any;  // HTML <var>, tests interaction with builtin keywords.
  }
}
// The "React" module is the runtime API of React.
declare module React {
  function createElement(...args: any[]): Element;
  function render(element: JSX.Element, node: HTMLElement): void;
}

// Fake a subcomponent, just to exercise components within components.
declare var Component: any;

let /** @type {JSX.Element} */ simple = <div></div>;

let /** @type {string} */ hello = 'hello';
let /** @type {JSX.Element} */ helloDiv = <div>
  {hello}
  hello, world
  <Component/>
</div>;

React.render(helloDiv, document.body);

