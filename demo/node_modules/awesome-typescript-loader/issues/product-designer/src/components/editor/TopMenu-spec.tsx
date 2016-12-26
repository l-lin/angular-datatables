import * as React from 'react';
import * as mousetrap from 'mousetrap';
import { shallow, mount, ReactWrapper } from 'enzyme';

import { iocContainer } from '../../utils/ioc';
import { TopMenu } from './TopMenu';
import { Product } from '../../models/Product';
import { ProductStore } from '../../stores/ProductStore';

describe('Top menu', function () {
  let product: Product;
  let productStore: ProductStore;

  beforeEach(() => {
    product = new Product();
    productStore = iocContainer.get(ProductStore);
  });

  it('should render as expected', function () {
    shallow(<TopMenu product={product} />);
  });

  describe('behavior', function () {
    let wrapper: ReactWrapper<any, any>;

    beforeEach(() => wrapper = mount(<TopMenu product={product} />));
    afterEach(() => wrapper.unmount());

    it('should deselect the product when clicking back', function () {
      const spy = sandbox.spy(productStore, 'select');
      wrapper.ref('back').simulate('click');
      expect(spy).has.been.calledWith(undefined);
    });

    it('should deselect the product when pressing backspace', function () {
      const spy = sandbox.spy(productStore, 'select');
      mousetrap.trigger('backspace');
      expect(spy).has.been.calledWith(undefined);
    });

    it('should download the product when clicking download', function () {
      const spy = sandbox.spy(product, 'download');
      wrapper.ref('download').simulate('click');
      expect(spy).has.been.calledOnce;
    });

    it('should download the product when pressing ctrl/cmd+s', function () {
      const spy = sandbox.spy(product, 'download');
      mousetrap.trigger('mod+s');
      expect(spy).has.been.calledOnce;
    });
  });
});
