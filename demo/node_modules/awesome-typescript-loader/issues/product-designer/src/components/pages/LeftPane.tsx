import * as React from 'react';
import { observer } from 'mobx-react';

import { Product } from '../../models/Product';
import { UIStore } from '../../stores/UIStore';
import { TreeView } from '../editor/tree';

interface IStyles {
  leftPane: string;
}

const styles = require<IStyles>('./EditorPage-style.scss');

interface IProps {
  product: Product;
  uiStore: UIStore;
}

function LeftPane(props: IProps) {
  return (
    <div className={styles.leftPane} style={{ width: props.uiStore.paneResizing.split }}>
      <TreeView product={props.product} />
    </div>
  );
}

export default observer<IProps>(LeftPane);
