import {expect} from 'chai';
import * as ts from 'typescript';

import {ANNOTATION_SUPPORT_CODE, convertDecorators} from '../src/decorator-annotator';
import * as tsickle from '../src/tsickle';

import * as testSupport from './test_support';

const testCaseFileName = 'testcase.ts';

function sources(sourceText: string): Map<string, string> {
  const sources = new Map<string, string>([
    [testCaseFileName, sourceText],
    ['bar.d.ts', 'declare module "bar" { export class BarService {} }']
  ]);
  return sources;
}

function verifyCompiles(sourceText: string) {
  // This throws an exception on error.
  testSupport.createProgram(sources(ANNOTATION_SUPPORT_CODE + sourceText));
}

describe(
    'decorator-annotator', () => {
      function translate(sourceText: string, allowErrors = false) {
        let program = testSupport.createProgram(sources(sourceText));
        let {output, diagnostics} =
            convertDecorators(program.getTypeChecker(), program.getSourceFile(testCaseFileName));
        if (!allowErrors) expect(diagnostics).to.be.empty;
        verifyCompiles(output);
        return {output, diagnostics};
      }

      function expectUnchanged(sourceText: string) {
        expect(translate(sourceText).output).to.equal(sourceText);
      }

      it('rejects non-typechecked inputs', () => {
        let sourceText = 'let x = 3;';
        let program = testSupport.createProgram(sources(sourceText));
        let goodSourceFile = program.getSourceFile(testCaseFileName);
        expect(() => convertDecorators(program.getTypeChecker(), goodSourceFile)).to.not.throw();
        let badSourceFile =
            ts.createSourceFile(testCaseFileName, sourceText, ts.ScriptTarget.ES6, true);
        expect(() => convertDecorators(program.getTypeChecker(), badSourceFile)).to.throw();
      });

      describe('class decorator rewriter', () => {
        it('leaves plain classes alone', () => { expectUnchanged(`class Foo {}`); });

        it('leaves un-marked decorators alone', () => {
          expectUnchanged(`
          let Decor: Function;
          @Decor class Foo {
            constructor(@Decor p: number) {}
            @Decor m(): void {}
          }`);
        });

        it('transforms decorated classes', () => {
          expect(translate(`
/** @Annotation */ let Test1: Function;
/** @Annotation */ let Test2: Function;
let param: any;
@Test1
@Test2(param)
class Foo {
  field: string;
}`).output).to.equal(`
/** @Annotation */ let Test1: Function;
/** @Annotation */ let Test2: Function;
let param: any;


class Foo {
  field: string;
static decorators: DecoratorInvocation[] = [
{ type: Test1 },
{ type: Test2, args: [param, ] },
];
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
];
}`);
        });

        it('accepts various complicated decorators', () => {
          expect(translate(`
/** @Annotation */ let Test1: Function;
/** @Annotation */ let Test2: Function;
/** @Annotation */ let Test3: Function;
/** @Annotation */ function Test4<T>(param: any): ClassDecorator { return null; }
let param: any;
@Test1({name: 'percentPipe'}, class ZZZ {})
@Test2
@Test3()
@Test4<string>(param)
class Foo {
}`).output).to.equal(`
/** @Annotation */ let Test1: Function;
/** @Annotation */ let Test2: Function;
/** @Annotation */ let Test3: Function;
/** @Annotation */ function Test4<T>(param: any): ClassDecorator { return null; }
let param: any;




class Foo {
static decorators: DecoratorInvocation[] = [
{ type: Test1, args: [{name: 'percentPipe'}, class ZZZ {}, ] },
{ type: Test2 },
{ type: Test3 },
{ type: Test4, args: [param, ] },
];
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
];
}`);
        });

        it(`doesn't eat 'export'`, () => {
          expect(translate(`
/** @Annotation */ let Test1: Function;
@Test1
export class Foo {
}`).output).to.equal(`
/** @Annotation */ let Test1: Function;

export class Foo {
static decorators: DecoratorInvocation[] = [
{ type: Test1 },
];
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
];
}`);
        });

        it(`handles nested classes`, () => {
          expect(translate(`
/** @Annotation */ let Test1: Function;
/** @Annotation */ let Test2: Function;
@Test1
export class Foo {
  foo() {
    @Test2
    class Bar {
    }
  }
}`).output).to.equal(`
/** @Annotation */ let Test1: Function;
/** @Annotation */ let Test2: Function;

export class Foo {
  foo() {
    \n    class Bar {
    static decorators: DecoratorInvocation[] = [
{ type: Test2 },
];
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
];
}
  }
static decorators: DecoratorInvocation[] = [
{ type: Test1 },
];
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
];
}`);
        });
      });

      describe('ctor decorator rewriter', () => {
        it('ignores ctors that have no applicable injects', () => {
          expectUnchanged(`
import {BarService} from 'bar';
class Foo {
  constructor(bar: BarService, num: number) {
  }
}`);
        });

        it('transforms injected ctors', () => {
          expect(translate(`
/** @Annotation */ let Inject: Function;
enum AnEnum { ONE, TWO, };
abstract class AbstractService {}
class Foo {
  constructor(@Inject bar: AbstractService, @Inject('enum') num: AnEnum) {
  }
}`).output).to.equal(`
/** @Annotation */ let Inject: Function;
enum AnEnum { ONE, TWO, };
abstract class AbstractService {}
class Foo {
  constructor( bar: AbstractService,  num: AnEnum) {
  }
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
{type: AbstractService, decorators: [{ type: Inject }, ]},
{type: AnEnum, decorators: [{ type: Inject, args: ['enum', ] }, ]},
];
}`);
        });

        it('stores non annotated parameters if the class has at least one decorator', () => {
          expect(translate(`
import {BarService} from 'bar';
/** @Annotation */ let Test1: Function;
@Test1()
class Foo {
  constructor(bar: BarService, num: number) {
  }
}`).output).to.equal(`
import {BarService} from 'bar';
/** @Annotation */ let Test1: Function;

class Foo {
  constructor(bar: BarService, num: number) {
  }
static decorators: DecoratorInvocation[] = [
{ type: Test1 },
];
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
{type: BarService, },
null,
];
}`);
        });

        it('handles complex ctor parameters', () => {
          expect(translate(`
import * as bar from 'bar';
/** @Annotation */ let Inject: Function;
let param: any;
class Foo {
  constructor(@Inject(param) x: bar.BarService, {a, b}, defArg = 3, optional?: bar.BarService) {
  }
}`).output).to.equal(`
import * as bar from 'bar';
/** @Annotation */ let Inject: Function;
let param: any;
class Foo {
  constructor( x: bar.BarService, {a, b}, defArg = 3, optional?: bar.BarService) {
  }
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
{type: bar.BarService, decorators: [{ type: Inject, args: [param, ] }, ]},
null,
null,
{type: bar.BarService, },
];
}`);
        });

        it('includes decorators for primitive type ctor parameters', () => {
          expect(translate(`
/** @Annotation */ let Inject: Function;
let APP_ID: any;
class ViewUtils {
  constructor(@Inject(APP_ID) private _appId: string) {}
}`).output).to.equal(`
/** @Annotation */ let Inject: Function;
let APP_ID: any;
class ViewUtils {
  constructor( private _appId: string) {}
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
{type: undefined, decorators: [{ type: Inject, args: [APP_ID, ] }, ]},
];
}`);
        });

        it('strips generic type arguments', () => {
          expect(translate(`
/** @Annotation */ let Inject: Function;
class Foo {
  constructor(@Inject typed: Promise<string>) {
  }
}`).output).to.equal(`
/** @Annotation */ let Inject: Function;
class Foo {
  constructor( typed: Promise<string>) {
  }
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
{type: Promise, decorators: [{ type: Inject }, ]},
];
}`);
        });

        it('avoids using interfaces as values', () => {
          expect(translate(`
/** @Annotation */ let Inject: Function = null;
class Class {}
interface Iface {}
class Foo {
  constructor(@Inject aClass: Class, @Inject aIface: Iface) {}
}`).output).to.equal(`
/** @Annotation */ let Inject: Function = null;
class Class {}
interface Iface {}
class Foo {
  constructor( aClass: Class,  aIface: Iface) {}
/** @nocollapse */
static ctorParameters: ({type: any, decorators?: DecoratorInvocation[]}|null)[] = [
{type: Class, decorators: [{ type: Inject }, ]},
{type: undefined, decorators: [{ type: Inject }, ]},
];
}`);
        });
      });

      describe('method decorator rewriter', () => {
        it('leaves ordinary methods alone', () => {
          expectUnchanged(`
class Foo {
  bar() {}
}`);
        });

        it('gathers decorators from methods', () => {
          expect(translate(`
/** @Annotation */ let Test1: Function;
class Foo {
  @Test1('somename')
  bar() {}
}`).output).to.equal(`
/** @Annotation */ let Test1: Function;
class Foo {
  \n  bar() {}
static propDecorators: {[key: string]: DecoratorInvocation[]} = {
'bar': [{ type: Test1, args: ['somename', ] },],
};
}`);
        });

        it('gathers decorators from fields and setters', () => {
          expect(translate(`
/** @Annotation */ let PropDecorator: Function;
class ClassWithDecorators {
  @PropDecorator("p1") @PropDecorator("p2") a;
  b;

  @PropDecorator("p3")
  set c(value) {}
}`).output).to.equal(`
/** @Annotation */ let PropDecorator: Function;
class ClassWithDecorators {
    a;
  b;

  \n  set c(value) {}
static propDecorators: {[key: string]: DecoratorInvocation[]} = {
'a': [{ type: PropDecorator, args: ["p1", ] },{ type: PropDecorator, args: ["p2", ] },],
'c': [{ type: PropDecorator, args: ["p3", ] },],
};
}`);
        });

        it('errors on weird class members', () => {
          let {diagnostics} = translate(
              `
/** @Annotation */ let Test1: Function;
let param: any;
class Foo {
  @Test1('somename')
  [param]() {}
}`,
              true /* allow errors */);

          expect(tsickle.formatDiagnostics(diagnostics))
              .to.equal(
                  'Error at testcase.ts:5:3: cannot process decorators on strangely named method');
        });
        it('avoids mangling code relying on ASI', () => {
          expect(translate(`
/** @Annotation */ let PropDecorator: Function;
class Foo {
  missingSemi = () => {}
  @PropDecorator other: number;
}`).output).to.equal(`
/** @Annotation */ let PropDecorator: Function;
class Foo {
  missingSemi = () => {}
   other: number;
static propDecorators: {[key: string]: DecoratorInvocation[]} = {
'other': [{ type: PropDecorator },],
};
}`);

        });
      });
    });
