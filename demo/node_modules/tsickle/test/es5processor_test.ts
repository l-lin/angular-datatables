import {expect} from 'chai';

import * as cliSupport from '../src/cli_support';
import * as es5processor from '../src/es5processor';

describe('convertCommonJsToGoogModule', () => {
  function expectCommonJs(fileName: string, content: string, isES5 = true) {
    return expect(
        es5processor.processES5(fileName, content, cliSupport.pathToModuleName, isES5).output);
  }

  it('adds a goog.module call', () => {
    // NB: no line break added below.
    expectCommonJs('a.js', `console.log('hello');`)
        .to.equal(`goog.module('a');var module = module || {id: 'a.js'};console.log('hello');`);
  });

  it('adds a goog.module call for ES6 mode', () => {
    // NB: no line break added below.
    expectCommonJs('a.js', `console.log('hello');`, false)
        .to.equal(`goog.module('a');var module = {id: 'a.js'};console.log('hello');`);
  });

  it('adds a goog.module call to empty files', () => {
    expectCommonJs('a.js', ``).to.equal(`goog.module('a');var module = module || {id: 'a.js'};`);
  });

  it('adds a goog.module call to empty-looking files', () => {
    expectCommonJs('a.js', `// empty`)
        .to.equal(`goog.module('a');var module = module || {id: 'a.js'};// empty`);
  });

  it('strips use strict directives', () => {
    // NB: no line break added below.
    expectCommonJs('a.js', `"use strict";
console.log('hello');`)
        .to.equal(`goog.module('a');var module = module || {id: 'a.js'};
console.log('hello');`);
  });

  it('converts require calls', () => {
    expectCommonJs('a.js', `var r = require('req/mod');`)
        .to.equal(
            `goog.module('a');var module = module || {id: 'a.js'};` +
            `var r = goog.require('req.mod');`);
  });

  it('converts require calls without assignments on first line', () => {
    expectCommonJs('a.js', `require('req/mod');`)
        .to.equal(
            `goog.module('a');var module = module || {id: 'a.js'};` +
            `var tsickle_module_0_ = goog.require('req.mod');`);
  });

  it('converts require calls without assignments on a new line', () => {
    expectCommonJs('a.js', `
require('req/mod');
require('other');`)
        .to.equal(`goog.module('a');var module = module || {id: 'a.js'};
var tsickle_module_0_ = goog.require('req.mod');
var tsickle_module_1_ = goog.require('other');`);
  });

  it('converts require calls without assignments after comments', () => {
    expectCommonJs('a.js', `
// Comment
require('req/mod');`)
        .to.equal(`goog.module('a');var module = module || {id: 'a.js'};
// Comment
var tsickle_module_0_ = goog.require('req.mod');`);
  });

  it('converts const require calls', () => {
    expectCommonJs('a.js', `const r = require('req/mod');`)
        .to.equal(
            `goog.module('a');var module = module || {id: 'a.js'};` +
            `var r = goog.require('req.mod');`);
  });

  describe('ES5 export *', () => {
    it('converts export * statements', () => {
      expectCommonJs('a.js', `__export(require('req/mod'));`)
          .to.equal(
              `goog.module('a');var module = module || {id: 'a.js'};var tsickle_module_0_ = goog.require('req.mod');__export(tsickle_module_0_);`);
    });
    it('uses correct module name with subsequent exports', () => {
      expectCommonJs('a.js', `__export(require('req/mod'));
var mod2 = require('req/mod');`)
          .to.equal(
              `goog.module('a');var module = module || {id: 'a.js'};var tsickle_module_0_ = goog.require('req.mod');__export(tsickle_module_0_);
var mod2 = tsickle_module_0_;`);
    });
    it('reuses an existing imported variable name', () => {
      expectCommonJs('a.js', `var mod = require('req/mod');
__export(require('req/mod'));`)
          .to.equal(
              `goog.module('a');var module = module || {id: 'a.js'};var mod = goog.require('req.mod');
__export(mod);`);
    });
  });

  it('resolves relative module URIs', () => {
    // See below for more fine-grained unit tests.
    expectCommonJs('a/b.js', `var r = require('./req/mod');`)
        .to.equal(
            `goog.module('a.b');var module = module || {id: 'a/b.js'};var r = goog.require('a.req.mod');`);
  });

  it('avoids mangling module names in goog: imports', () => {
    expectCommonJs('a/b.js', `
var goog_use_Foo_1 = require('goog:foo_bar.baz');`)
        .to.equal(`goog.module('a.b');var module = module || {id: 'a/b.js'};
var goog_use_Foo_1 = goog.require('foo_bar.baz');`);
  });

  it('resolves default goog: module imports', () => {
    expectCommonJs('a/b.js', `
var goog_use_Foo_1 = require('goog:use.Foo');
console.log(goog_use_Foo_1.default);`)
        .to.equal(`goog.module('a.b');var module = module || {id: 'a/b.js'};
var goog_use_Foo_1 = goog.require('use.Foo');
console.log(goog_use_Foo_1        );`);
    // NB: the whitespace above matches the .default part, so that
    // source maps are not impacted.
  });

  it('leaves single .default accesses alone', () => {
    // This is a repro for a bug when no goog: symbols are found.
    expectCommonJs('a/b.js', `
console.log(this.default);
console.log(foo.bar.default);`)
        .to.equal(`goog.module('a.b');var module = module || {id: 'a/b.js'};
console.log(this.default);
console.log(foo.bar.default);`);
  });

  it('inserts the module after "use strict"', () => {
    expectCommonJs('a/b.js', `/**
* docstring here
*/
"use strict";
var foo = bar;
`).to.equal(`goog.module('a.b');var module = module || {id: 'a/b.js'};/**
* docstring here
*/

var foo = bar;
`);
  });

  it('deduplicates module imports', () => {
    expectCommonJs('a/b.js', `var foo_1 = require('goog:foo');
var foo_2 = require('goog:foo');
foo_1.A, foo_2.B, foo_2.default, foo_3.default;
`).to.equal(`goog.module('a.b');var module = module || {id: 'a/b.js'};var foo_1 = goog.require('foo');
var foo_2 = foo_1;
foo_1.A, foo_2.B, foo_2        , foo_3.default;
`);
  });

  it('gathers referenced modules', () => {
    let {referencedModules} = es5processor.processES5(
        'a/b', `
require('../foo/bare-require');
var googRequire = require('goog:foo.bar');
var es6RelativeRequire = require('./relative');
var es6NonRelativeRequire = require('non/relative');
__export(require('./export-star');
`,
        cliSupport.pathToModuleName);

    return expect(referencedModules).to.deep.equal([
      'foo.bare-require',
      'foo.bar',
      'a.relative',
      'non.relative',
      'a.export-star',
    ]);
  });
});
