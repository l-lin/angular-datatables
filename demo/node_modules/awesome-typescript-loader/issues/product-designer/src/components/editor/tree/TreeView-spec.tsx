import * as React from 'react';
import { shallow } from 'enzyme';

import { TreeView } from './TreeView';
import { Product } from '../../../models/Product';

describe('Tree view', function () {
  it('should render properly', function () {
    const product = new Product();
    shallow(<TreeView product={product} />);
  });
});
