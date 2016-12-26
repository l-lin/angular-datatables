import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';

import { inject } from '../../utils/ioc';
import { ProductStore } from '../../stores/ProductStore';
import { UIStore } from '../../stores/UIStore';
import { Product } from '../../models/Product';
import { ProductListItem } from './ProductListItem';
import { readFileDropEvent } from '../../helpers/fileUpload';
import { RemoveProductModal } from './RemoveProductModal';

const style = require<any>('./ProductList-style.scss');

@observer
export class ProductList extends React.Component<{}, any> {
  @inject(UIStore)
  uiStore: UIStore;

  @inject(ProductStore)
  productStore: ProductStore;

  @observable
  isDragDropOver = false;

  @observable
  productToRemove?: Product;

  refs: {
    main: HTMLDivElement;
  };

  constructor() {
    super();

    this.onRemoveProduct = this.onRemoveProduct.bind(this);
    this.unsetProductToRemove = this.unsetProductToRemove.bind(this);
    this.onApproveRemove = this.onApproveRemove.bind(this);
  }

  componentDidMount() {
    let counter = 0;
    $(this.refs.main)
      .on('dragenter', (e) => {
        e.preventDefault();
        if (counter++ === 0) { this.setDragDropOver(true); }
        return false;
      })
      .on('dragleave', (e) => {
        e.preventDefault();
        if (--counter === 0) { this.setDragDropOver(false); }
        return false;
      })
      .on('dragover dragend', () => false)
      .on('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setDragDropOver(false);
        counter = 0;

        const handle = readFileDropEvent(e.originalEvent as DragEvent);
        Product.load(handle)
          .then(p => {
            if (p) {
              this.productStore.add(p);
            }
          });

        return false;
      });
  }

  @action('set drag drop over')
  setDragDropOver(value: boolean) {
    this.isDragDropOver = value;
  }

  @action('set product to remove')
  onRemoveProduct(product: Product) {
    this.productToRemove = product;
  }

  @action('unset product to remove')
  unsetProductToRemove() {
    this.productToRemove = undefined;
  }

  @action('approve product removal')
  onApproveRemove() {
    if (!this.productToRemove) { return; }
    this.productToRemove.remove();
  }

  render() {
    const cls = this.isDragDropOver ? style.dropOver : style.list;

    return (
      <div ref="main" className={classNames('ui', cls, 'segment')} style={{ maxHeight: this.uiStore.windowDimensions.height - 300 }}>
        <div className="ui relaxed divided list">
          {this.productStore.productsOrderedByModificationTime.map(product =>
            <ProductListItem key={product.uid} product={product} onRemove={this.onRemoveProduct} />
          )}
        </div>
        <RemoveProductModal
          product={this.productToRemove}
          onClosed={this.unsetProductToRemove}
          onApprove={this.onApproveRemove}
          />
      </div>
    );
  }
}
