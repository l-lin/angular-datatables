const RESERVED_KEYS = {
  length: true,
  key: true,
  setItem: true,
  getItem: true,
  removeItem: true,
  clear: true,
};

export class StorageShim {
  [key: string]: any;

  get length() {
    return Object.keys(this).length;
  }

  key(n: number) {
    const key = Object.keys(this)[n];
    return key || (key === '' ? key : undefined);
  }

  setItem(key: string, value: any) {
    if (key in RESERVED_KEYS) {
      throw new Error(`Cannot assign to reserved key "${key}"`);
    }

    this[key] = '' + value;
  }

  getItem(key: string) {
    if (key in RESERVED_KEYS) {
      throw new Error(`Cannot get reserved key "${key}"`);
    }

    const item = this[key];
    return item || (item === '' ? item : undefined);
  }

  removeItem(key: string) {
    delete this[key];
  }

  clear() {
    for (let key in this) {
      this.removeItem(key);
    }
  }
}
