# TS-helpers

[![Dependencies Status](https://david-dm.org/ngParty/ts-helpers.svg)](https://david-dm.org/ngParty/ts-helpers)
[![devDependency Status](https://david-dm.org/ngParty/ts-helpers/dev-status.svg)](https://david-dm.org/ngParty/ts-helpers#info=devDependencies)
[![npm](https://img.shields.io/npm/v/ts-helpers.svg)](https://www.npmjs.com/package/ts-helpers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ngParty/ts-helpers/master/LICENSE)
 
Typescript helpers for compiling typescript while specifying `--noEmitHelpers` within your `tsconfig.json`.
> Cross platform ( Node/Browser/WebWorker )

## Why?

If you are using one of following ES2015/ES.next features with Typescript:
- inheritance via `class Foo extends Moo{}`
- `async/await`
- decorators via `experimentalDecorators` 
- metadata reflection via `emitDecoratorMetadata`
 
Typescript will generate helper code in every one file.
This can be a problem when dealing with code coverage or payload size of you library/app

To mitigate this problem Typescript starting from version **1.8** allow us to specify `noEmitHelpers: true`which wont generate these helpers.

And that's where this little utility comes into play, it defines those helpers just once for whole app.

## Installation

`npm install --save-dev ts-helpers`

then load it from your app root file:

```typescript
// main.ts
import 'ts-helpers';
```

and set tsconfig `noEmitHelpers` like following example:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "noImplicitAny": false,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "pretty": true,
    "noEmitHelpers": true
  },
  "exclude": [
    "node_modules"     
  ]
}
```


That's it! enjoy ;)
