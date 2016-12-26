import * as React from 'react';

import { ProductList } from '../products/ProductList';
import { ProductCreationForm } from '../products/ProductCreationForm';

interface IStyles {
  container: string;
}

const styles = require<IStyles>('./ProductListPage-style.scss');

export class ProductListPage extends React.Component<{}, any> {
  render() {
    return (
      <div className={styles.container}>
        <div className="ui middle aligned centered grid">
          <div className="row">
            <div className="column">
              <h1>Product Designer</h1>
              <ProductList />
              <ProductCreationForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
