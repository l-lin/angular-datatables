import * as uuid from 'node-uuid';
import { observable, action, createTransformer, reaction, isObservable } from 'mobx';
import * as _ from 'lodash';

import { iocContainer, inject } from '../utils/ioc';
import { MessageType } from './Message';
import { ProductStore } from '../stores/ProductStore';
import { MessageStore } from '../stores/MessageStore';
import { ISerializedModel, BaseModel } from './Base';
import { ProductPersister } from '../stores/ProductPersister';
import { IFileHandle } from '../helpers/fileUpload';

export interface ISerializedProduct extends ISerializedModel {
  name?: string;
  lastModified?: string;
  revision?: string;
}

const transformer = createTransformer<Product, ISerializedProduct>(p => {
  return {
    uid: p.uid,
    name: p.name,
    lastModified: p.lastModified.toISOString(),
  };
});

const ignoreOnAutoSave = ['lastModified'];

export class Product extends BaseModel {
  static autoSaveDelay = 500;
  private static deserializing = false;

  @inject(ProductPersister)
  productPersister: ProductPersister;

  @observable
  name?: string;

  @observable
  lastModified = new Date();

  revision: string = uuid.v4();

  store?: ProductStore;

  private initialRevision: string;

  constructor(name?: string) {
    super();

    this.name = name;
    this.initialRevision = this.revision;

    const touchTrackedProperties = () => {
      const observed: any = {};

      // detect changes to any observable property except for those that ignored
      Object.keys(this)
        .filter(k => isObservable(this, k) && ignoreOnAutoSave.indexOf(k) === -1)
        .map(k => observed[k] = (this as any)[k]);

      return observed;
    };

    // react to changes to tracked fields and immediately stamp the change.
    reaction('product changed - stamp',
      () => touchTrackedProperties(),
      action('stamp product change', () => {
        this.lastModified = new Date();
        this.revision = uuid.v4();
      }));

    // react to changes to tracked fields and save debounced
    reaction('product changed - auto save',
      () => touchTrackedProperties(),
      action('check should save product', () => {
        // if the revision is the same as when the instance initialized, skip saving it.
        if (Product.deserializing || this.revision === this.initialRevision) {
          return;
        }

        action('save product', () => this.productPersister.save(this.serialize()))();
      }), true, Product.autoSaveDelay);
  }

  @action('deserialize product')
  static deserialize(json: ISerializedProduct): Product {
    Product.deserializing = true;
    const product = new Product();
    product.updateFromSerialized(json);
    Product.deserializing = false;

    return product;
  }

  @action('load product')
  static load(file: IFileHandle): Promise<Product> {
    if (!_.endsWith(file.name, '.product') && !_.endsWith(file.name, '.prodx')) {
      const messageStore = iocContainer.get(MessageStore);
      messageStore.add('The file does not appear to be a valid .product or .prodx file.', {
        header: 'Invalid file',
        type: MessageType.Error,
        dismissable: true,
        duration: 5000,
      });

      return Promise.resolve(undefined);
    }

    return Promise.resolve(new Product());
  }

  remove() {
    return this.store && this.store.remove(this);
  }

  select() {
    return this.store && this.store.select(this);
  }

  @action('download product')
  download() {
  }

  serialize(): ISerializedProduct {
    return transformer(this);
  }

  protected updateFromSerialized(json: ISerializedProduct): this {
    super.updateFromSerialized(json);
    this.name = json.name;
    this.lastModified = json.lastModified ? new Date(json.lastModified) : this.lastModified;
    return this;
  }
}
