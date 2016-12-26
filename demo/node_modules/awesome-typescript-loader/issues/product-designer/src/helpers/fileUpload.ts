import * as _ from 'lodash';

export interface IFileHandle {
  name: string;
  read: (callback: (content: string) => void) => void;
}

export function isValidFile(e: DragEvent) {
  if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) {
    return false;
  }

  const file = e.dataTransfer.files[0];
  return _.endsWith(file.name, '.product') || _.endsWith(file.name, '.prodx');
}

export function readFileInput(input: HTMLInputElement): IFileHandle | undefined {
  const files = input.files;
  if (!files || !files.length) { return undefined; }

  return readFile(files[0]);
}

export function readFileDropEvent(e: DragEvent) {
  return readFile(e.dataTransfer.files[0]);
}

export function readFile(file: File): IFileHandle {
  return {
    name: file.name,
    read: function (callback) {
      const reader = new FileReader();
      reader.onload = function () {
        callback(reader.result);
      };

      reader.readAsText(file);
    },
  };
}
