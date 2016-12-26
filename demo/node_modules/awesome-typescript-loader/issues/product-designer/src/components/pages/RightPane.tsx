import * as React from 'react';
import { observer } from 'mobx-react';

import { Product } from '../../models/Product';
import { UIStore } from '../../stores/UIStore';

interface IStyles {
  rightPane: string;
}

const styles = require<IStyles>('./EditorPage-style.scss');

interface IProps {
  product: Product;
  uiStore: UIStore;
}

function RightPane(props: IProps) {
  return (
    <div className={styles.rightPane} style={{ left: props.uiStore.paneResizing.split }} />
  );
};

export default observer<IProps>(RightPane);
