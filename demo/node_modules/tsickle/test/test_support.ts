import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as ts from 'typescript';

import * as cliSupport from '../src/cli_support';
import * as tsickle from '../src/tsickle';
import {toArray} from '../src/util';

/** The TypeScript compiler options used by the test suite. */
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES6,
  skipDefaultLibCheck: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  noEmitHelpers: true,
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.React,
  // Flags below are needed to make sure source paths are correctly set on write calls.
  rootDir: path.resolve(process.cwd()),
  outDir: '.',
};

const {cachedLibPath, cachedLib} = (function() {
  let host = ts.createCompilerHost(compilerOptions);
  let fn = host.getDefaultLibFileName(compilerOptions);
  let p = ts.getDefaultLibFilePath(compilerOptions);
  return {cachedLibPath: p, cachedLib: host.getSourceFile(fn, ts.ScriptTarget.ES6)};
})();

/** Creates a ts.Program from a set of input files. */
export function createProgram(sources: Map<string, string>): ts.Program {
  let host = ts.createCompilerHost(compilerOptions);

  // Fake out host.directoryExists so that it doesn't read through node_modules/@types.
  let realDirectoryExists = host.directoryExists;
  host.directoryExists = dirName => {
    if (path.isAbsolute(dirName)) {
      let relName = path.relative(process.cwd(), dirName);
      if (relName === 'node_modules/@types') return false;
    }
    return realDirectoryExists ? realDirectoryExists(dirName) : false;
  };

  host.getSourceFile = function(
                           fileName: string, languageVersion: ts.ScriptTarget,
                           onError?: (msg: string) => void): ts.SourceFile {
    if (fileName === cachedLibPath) return cachedLib;
    if (path.isAbsolute(fileName)) fileName = path.relative(process.cwd(), fileName);
    let file = sources.get(fileName);
    if (file) {
      return ts.createSourceFile(fileName, file, ts.ScriptTarget.Latest, true);
    }
    throw new Error('unexpected file read of ' + fileName + ' not in ' + toArray(sources.keys()));
  };

  return ts.createProgram(toArray(sources.keys()), compilerOptions, host);
}

/** Emits transpiled output with tsickle postprocessing.  Throws an exception on errors. */
export function emit(program: ts.Program): {[fileName: string]: string} {
  let transformed: {[fileName: string]: string} = {};
  let {diagnostics} = program.emit(undefined, (fileName: string, data: string) => {
    transformed[fileName] =
        tsickle.convertCommonJsToGoogModule(fileName, data, cliSupport.pathToModuleName).output;
  });
  if (diagnostics.length > 0) {
    throw new Error(tsickle.formatDiagnostics(diagnostics));
  }
  return transformed;
}

export class GoldenFileTest {
  // Path to directory containing test files.
  path: string;
  // Input .ts/.tsx file names.
  tsFiles: string[];

  constructor(path: string, tsFiles: string[]) {
    this.path = path;
    this.tsFiles = tsFiles;
  }

  get name(): string { return path.basename(this.path); }

  get externsPath(): string { return path.join(this.path, 'externs.js'); }

  get tsPaths(): string[] { return this.tsFiles.map(f => path.join(this.path, f)); }

  get jsPaths(): string[] {
    return this.tsFiles.map(f => path.join(this.path, GoldenFileTest.tsPathToJs(f)));
  }

  public static tsPathToJs(tsPath: string): string { return tsPath.replace(/\.tsx?$/, '.js'); }
}

export function goldenTests(): GoldenFileTest[] {
  let basePath = path.join(__dirname, '..', '..', 'test_files');
  let testNames = fs.readdirSync(basePath);

  let tests = testNames.map(testName => {
    let testDir = path.join(basePath, testName);
    testDir = path.relative(process.cwd(), testDir);
    let tsPaths = glob.sync(path.join(testDir, '*.ts'));
    tsPaths = tsPaths.concat(glob.sync(path.join(testDir, '*.tsx')));
    tsPaths = tsPaths.filter(p => !p.match(/\.tsickle\./) && !p.match(/\.decorated\./));
    let tsFiles = tsPaths.map(f => path.relative(testDir, f));
    return new GoldenFileTest(testDir, tsFiles);
  });

  return tests;
}
