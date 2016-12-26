import * as React from 'react';
import * as classNames from 'classnames';
import * as mousetrap from 'mousetrap';

import { inject } from '../../utils/ioc';
import { Product } from '../../models/Product';
import { ProductStore } from '../../stores/ProductStore';
import { Search } from './search';
import { ValidationMessageIndicator } from './validation';

interface IStyles {
  pane: string;
}

const styles = require<IStyles>('./TopMenu-style.scss');

interface IProps {
  product: Product;
}

export class TopMenu extends React.Component<IProps, any> {
  @inject(ProductStore)
  productStore: ProductStore;

  constructor() {
    super();

    this.onBackClick = this.onBackClick.bind(this);
    this.onDownloadClick = this.onDownloadClick.bind(this);
  }

  componentDidMount() {
    mousetrap.bind('backspace', () => {
      this.productStore.select(undefined);
      return false;
    });

    mousetrap.bind('mod+s', () => {
      this.props.product.download();
      return false;
    });
  }

  componentWillUnmount() {
    mousetrap.unbind('backspace');
    mousetrap.unbind('mod+s');
  }

  onBackClick() {
    this.productStore.select(undefined);
  }

  onDownloadClick() {
    this.props.product.download();
  }

  render() {
    return (
      <div className={classNames('ui', 'small', styles.pane, 'menu')}>
        <a ref="back" className="item" onClick={this.onBackClick}>
          <i className="chevron left icon" /> Go back
        </a>
        <a ref="download" className="item" onClick={this.onDownloadClick}>
          <i className="download icon" /> Download
        </a>

        <div className="right menu">
          <ValidationMessageIndicator />
          <Search product={this.props.product} />
        </div>
      </div>
    );
  }
}
