import * as React from 'react';
import { observer } from 'mobx-react';
import MobxDevTools from 'mobx-react-devtools';

import 'semantic-ui-css/components/reset.css';
import 'semantic-ui-css/components/site.css';

import { inject } from '../utils/ioc';
import { ProductStore } from '../stores/ProductStore';
import { UIStore } from '../stores/UIStore';
import { ProductListPage } from './pages/ProductListPage';
import { EditorPage } from './pages/EditorPage';
import { MessageList } from './messages/MessageList';

const styles = require<any>('./App-style.scss');

export const DevTools = observer(function DevTools(props: { uiStore?: UIStore }) {
  if (__DEV__) {
    return <MobxDevTools position={{ top: 0, left: props.uiStore ? props.uiStore.windowDimensions.width / 2 - 75 : '50%' }} />;
  }

  return <div />;
});

@observer
export class App extends React.Component<{}, any> {
  @inject(ProductStore)
  productStore: ProductStore;

  @inject(UIStore)
  uiStore: UIStore;

  render() {
    return (
      <div className={styles.app}>
        {this.productStore.selected
          ? <EditorPage product={this.productStore.selected} />
          : <ProductListPage />}
        <DevTools uiStore={this.uiStore} />
        <MessageList />
      </div>
    );
  }
}
