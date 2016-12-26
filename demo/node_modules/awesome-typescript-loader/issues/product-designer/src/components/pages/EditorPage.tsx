import * as React from 'react';

import { inject } from '../../utils/ioc';
import { UIStore } from '../../stores/UIStore';

import { Product } from '../../models/Product';
import { TopMenu } from '../editor/TopMenu';
import { PaneResizer } from '../editor/PaneResizer';
import LeftPane from './LeftPane';
import RightPane from './RightPane';

interface IStyles {
  container: string;
  leftPane: string;
  rightPane: string;
}

const styles = require<IStyles>('./EditorPage-style.scss');

interface IProps {
  product: Product;
}

export class EditorPage extends React.Component<IProps, any> {
  @inject(UIStore)
  uiStore: UIStore;

  render() {
    const {product} = this.props;

    return (
      <div className={styles.container}>
        <TopMenu product={product} />
        <LeftPane product={product} uiStore={this.uiStore} />
        <PaneResizer />
        <RightPane product={product} uiStore={this.uiStore} />
      </div>
    );
  }
}
