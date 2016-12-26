import { ISerializedProduct, Product } from '../models/Product';
import { ProductStore } from './ProductStore';

export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class ProductPersister {
  static readonly indexKey = 'product-index';
  static readonly productKeyPrefix = 'product-';
  readonly storage: IStorage;
  private _index: string[];

  private get index() {
    if (!this._index) {
      const json = this.storage.getItem(ProductPersister.indexKey);
      this._index = json ? JSON.parse<string[]>(json) : [];
    }

    return this._index;
  }

  constructor(storage: IStorage = ProductPersister.storageFactory()) {
    this.storage = storage;
  }

  static storageFactory: () => IStorage = () => localStorage;

  private static getProductKey(id: string) {
    return `${ProductPersister.productKeyPrefix}${id}`;
  }

  save(product: Product | ISerializedProduct) {
    if (this.index.indexOf(product.uid) === -1) {
      this.index.push(product.uid);
      this.saveIndex();
    }

    const serialized = product instanceof Product ? product.serialize() : product;
    this.storage.setItem(ProductPersister.getProductKey(product.uid), JSON.stringify(serialized));
  }

  load(store?: ProductStore) {
    const products: Product[] = [];
    this.index.forEach(i => {
      const p = this.loadProduct(i);
      if (p) {
        p.store = store;
        products.push(p);
      }
    });

    return products;
  }

  remove(product: Product) {
    const index = this.indexOf(product);
    if (index > -1) {
      this.index.splice(this.indexOf(product), 1);
      this.saveIndex();
    }

    this.storage.removeItem(ProductPersister.getProductKey(product.uid));
  }

  private saveIndex() {
    this.storage.setItem(ProductPersister.indexKey, JSON.stringify(this.index));
  }

  private loadProduct(id: string) {
    const value = this.storage.getItem(ProductPersister.getProductKey(id));
    if (!value) {
      return undefined;
    }

    const json = JSON.parse<ISerializedProduct>(value);
    if (json) {
      return Product.deserialize(json);
    }

    return undefined;
  }

  private indexOf(product: Product) {
    return this.index.indexOf(product.uid);
  }
}
