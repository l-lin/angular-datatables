import {expect} from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import {ANNOTATION_SUPPORT_CODE} from '../src/decorator-annotator';
import * as tsickle from '../src/tsickle';
import {toArray} from '../src/util';

import * as testSupport from './test_support';

let RUN_TESTS_MATCHING: RegExp|null = null;
// RUN_TESTS_MATCHING = /fields/;

// If true, update all the golden .js files to be whatever tsickle
// produces from the .ts source. Do not change this code but run as:
//     UPDATE_GOLDENS=y gulp test
const UPDATE_GOLDENS = !!process.env.UPDATE_GOLDENS;

/**
 * compareAgainstGoldens compares a test output against the content in a golden
 * path, updating the content of the golden when UPDATE_GOLDENS is true.
 *
 * @param output The expected output, where the empty string indicates
 *    the file is expected to exist and be empty, while null indicates
 *    the file is expected to not exist.  (This subtlety is used for
 *    externs files, where the majority of tests are not expected to
 *    produce one.)
 */
function compareAgainstGolden(output: string|null, path: string) {
  let golden: string|null = null;
  try {
    golden = fs.readFileSync(path, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT' && (UPDATE_GOLDENS || output === null)) {
      // A missing file is acceptable if we're updating goldens or
      // if we're expected to produce no output.
    } else {
      throw e;
    }
  }

  if (UPDATE_GOLDENS && output !== golden) {
    console.log('Updating golden file for', path);
    if (output !== null) {
      fs.writeFileSync(path, output, 'utf-8');
    } else {
      // The desired golden state is for there to be no output file.
      // Ensure no file exists.
      try {
        fs.unlinkSync(path);
      } catch (e) {
        // ignore.
      }
    }
  } else {
    expect(output).to.equal(golden);
  }
}

describe('golden tests', () => {
  testSupport.goldenTests().forEach((test) => {
    if (RUN_TESTS_MATCHING && !RUN_TESTS_MATCHING.exec(test.name)) {
      it.skip(test.name);
      return;
    }
    let options: tsickle.Options = {
      // See test_files/jsdoc_types/nevertyped.ts.
      typeBlackListPaths: new Set(['test_files/jsdoc_types/nevertyped.ts'])
    };
    if (/\.untyped\b/.test(test.name)) {
      options.untyped = true;
    }
    it(test.name, () => {
      // Read all the inputs into a map, and create a ts.Program from them.
      let tsSources = new Map<string, string>();
      for (let tsFile of test.tsFiles) {
        let tsPath = path.join(test.path, tsFile);
        let tsSource = fs.readFileSync(tsPath, 'utf-8');
        tsSources.set(tsPath, tsSource);
      }
      let program = testSupport.createProgram(tsSources);
      {
        let diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
          throw new Error(tsickle.formatDiagnostics(diagnostics));
        }
      }

      // Run TypeScript through the decorator annotator and emit goldens if
      // it changed anything.
      let convertDecoratorsMadeChange = false;
      for (let tsPath of toArray(tsSources.keys())) {
        // Run TypeScript through the decorator annotator and emit goldens if
        // it changed anything.
        let {output, diagnostics} =
            tsickle.convertDecorators(program.getTypeChecker(), program.getSourceFile(tsPath));
        expect(diagnostics).to.be.empty;
        if (output !== tsSources.get(tsPath)) {
          output += ANNOTATION_SUPPORT_CODE;
          let decoratedPath = tsPath.replace(/.ts(x)?$/, '.decorated.ts$1');
          expect(decoratedPath).to.not.equal(tsPath);
          compareAgainstGolden(output, decoratedPath);
          tsSources.set(tsPath, output);
          convertDecoratorsMadeChange = true;
        }
      }
      if (convertDecoratorsMadeChange) {
        // A file changed; reload the program on the new output.
        program = testSupport.createProgram(tsSources);
      }

      // Tsickle-annotate all the sources, comparing against goldens, and gather the
      // generated externs and tsickle-processed sources.
      let allExterns: string|null = null;
      let tsickleSources = new Map<string, string>();
      for (let tsPath of toArray(tsSources.keys())) {
        let warnings: ts.Diagnostic[] = [];
        options.logWarning = (diag: ts.Diagnostic) => { warnings.push(diag); };
        // Run TypeScript through tsickle and compare against goldens.
        let {output, externs, diagnostics} =
            tsickle.annotate(program, program.getSourceFile(tsPath), options);
        if (externs) allExterns = externs;

        // If there were any diagnostics, convert them into strings for
        // the golden output.
        let fileOutput = output;
        diagnostics.push(...warnings);
        if (diagnostics.length > 0) {
          // Munge the filenames in the diagnostics so that they don't include
          // the tsickle checkout path.
          for (let diag of diagnostics) {
            let fileName = diag.file.fileName;
            diag.file.fileName = fileName.substr(fileName.indexOf('test_files'));
          }
          fileOutput = tsickle.formatDiagnostics(diagnostics) + '\n====\n' + output;
        }
        let tsicklePath = tsPath.replace(/.ts(x)?$/, '.tsickle.ts$1');
        expect(tsicklePath).to.not.equal(tsPath);
        compareAgainstGolden(fileOutput, tsicklePath);
        tsickleSources.set(tsPath, output);
      }
      compareAgainstGolden(allExterns, test.externsPath);

      // Run tsickled TypeScript through TypeScript compiler
      // and compare against goldens.
      program = testSupport.createProgram(tsickleSources);
      let jsSources = testSupport.emit(program);
      for (let jsPath of Object.keys(jsSources)) {
        compareAgainstGolden(jsSources[jsPath], jsPath);
      }
    });
  });
});
