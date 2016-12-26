import * as fs from 'fs';
import * as closure from 'google-closure-compiler';

import {goldenTests} from './test_support';

export function checkClosureCompile(
    jsFiles: string[], externsFiles: string[], done: (err?: Error) => void) {
  let startTime = Date.now();
  let total = jsFiles.length;
  if (!total) throw new Error('No JS files in ' + JSON.stringify(jsFiles));

  let CLOSURE_COMPILER_OPTS: closure.CompileOptions = {
    'checks_only': true,
    'jscomp_error': 'checkTypes',
    'js': jsFiles,
    'externs': externsFiles,
    'language_in': 'ECMASCRIPT6_STRICT',
  };

  let compiler = new closure.compiler(CLOSURE_COMPILER_OPTS);
  compiler.run((exitCode, stdout, stderr) => {
    console.log('Closure compilation:', total, 'done after', Date.now() - startTime, 'ms');
    if (exitCode !== 0) {
      done(new Error(stderr));
    } else {
      done();
    }
  });
}

describe('golden file tests', () => {
  it('generates correct Closure code', (done: (err?: Error) => void) => {
    let tests = goldenTests();
    let goldenJs = ([] as string[]).concat(...tests.map(t => t.jsPaths));
    let externs = tests.map(t => t.externsPath).filter(fs.existsSync);
    checkClosureCompile(goldenJs, externs, done);
  });
});
