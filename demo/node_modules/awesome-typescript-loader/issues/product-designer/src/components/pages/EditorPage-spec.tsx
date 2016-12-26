import * as React from 'react';
import { mount } from 'enzyme';

import { EditorPage } from './EditorPage';
import { Product } from '../../models/Product';

describe('Editor page', function () {
  let product: Product;

  beforeEach(function () {
    product = new Product();
  });

  it('should render as expected', function () {
    mount(<EditorPage product={product} />);
  });
});
