import { observable, action, computed } from 'mobx';
import * as _ from 'lodash';

import { inject } from '../utils/ioc';
import { Product } from '../models/Product';
import { ProductPersister } from './ProductPersister';

export class ProductStore {
  @observable
  products: Product[] = [];

  @observable
  selected: Product | undefined;

  @inject(ProductPersister)
  private persister: ProductPersister;

  @computed
  get productsOrderedByModificationTime() {
    return _.orderBy(this.products, 'lastModified', 'desc');
  }

  constructor() {
    this.load();
  }

  add(product: Product): Product;
  add(name: string): Product;
  @action('add product')
  add(arg: Product | string): Product {
    let product: Product;
    if (typeof arg === 'string') {
      product = new Product(arg);
    } else {
      product = arg;
    }

    if (this.has(product)) {
      throw new Error('The product is already added to the store.');
    }

    product.store = this;
    this.products.push(product);
    this.persister.save(product);

    this.selected = product;
    return product;
  }

  @action('remove product')
  remove(product: Product) {
    const index = this.indexOf(product);
    if (index === -1) {
      throw new Error('The product is not added to the store.');
    }

    this.products.splice(index, 1);
    this.persister.remove(product);
  }

  @action('select product')
  select(product: Product | undefined) {
    if (product && !this.has(product)) {
      throw new Error('The product is not added to the store.');
    }

    this.selected = product;
  }

  @action('load product')
  private load() {
    this.products = this.persister.load(this);
  }

  private indexOf(product: Product) {
    return this.products.indexOf(product);
  }

  private has(product: Product) {
    return this.indexOf(product) > -1;
  }
}
