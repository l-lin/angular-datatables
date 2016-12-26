import * as path from 'path';

// Postprocess generated JS.
export function pathToModuleName(context: string, fileName: string): string {
  if (fileName[0] === '.') {
    fileName = path.join(path.dirname(context), fileName);
  }
  return fileName.replace(/\.js$/, '').replace(/\//g, '.');
}
