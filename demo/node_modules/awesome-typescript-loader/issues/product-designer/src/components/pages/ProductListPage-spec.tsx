import * as React from 'react';
import { shallow } from 'enzyme';

import { ProductListPage } from './ProductListPage';
import { ProductList } from '../products/ProductList';
import { ProductCreationForm } from '../products/ProductCreationForm';

describe('Product list page', function () {
  it('should render as expected', function () {
    const wrapper = shallow(<ProductListPage />);
    expect(wrapper.contains(<ProductList />)).to.be.true;
    expect(wrapper.contains(<ProductCreationForm />)).to.be.true;
  });
});
