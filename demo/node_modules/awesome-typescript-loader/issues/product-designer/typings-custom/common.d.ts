declare var __DEV__: boolean;
declare var __TEST__: boolean;
declare var BASE_URL: string;

interface JSON {
  /**
    * Converts a JavaScript Object Notation (JSON) string into an object.
    * @param text A valid JSON string.
    * @param reviver A function that transforms the results. This function is called for each member of the object.
    * If a member contains nested objects, the nested objects are transformed before the parent object is.
    */
  parse<T>(text: string, reviver?: (key: any, value: any) => any): T;
}

declare var expect: Chai.ExpectStatic;

declare function createFileList(files: File[]): FileList;
declare function createFile(path: string): File;
