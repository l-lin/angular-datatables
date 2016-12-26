declare type ClassValue = string | number | ClassDictionary | ClassArray | undefined;

interface ClassDictionary {
	[id: string]: boolean;
}

interface ClassArray extends Array<ClassValue> { }

interface ClassNamesFn {
	(...classes: ClassValue[]): string;
}

declare var classNames: ClassNamesFn;

declare module 'classnames' {
	export = classNames
}
