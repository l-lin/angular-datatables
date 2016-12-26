import * as React from 'react';

import { Product } from '../../../models/Product';
import { ProductTreeNode } from './ProductTreeNode';

interface IProps {
  product: Product;
}

export class TreeView extends React.Component<IProps, any> {
  render() {
    return (
      <div>
        <ProductTreeNode />
      </div>
    );
  }
}
