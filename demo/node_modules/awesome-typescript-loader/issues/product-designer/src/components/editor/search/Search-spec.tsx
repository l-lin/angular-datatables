import * as React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import * as mousetrap from 'mousetrap';

import { Search } from './Search';
import { Product } from '../../../models/Product';

describe('Search', function () {
  let product: Product;

  beforeEach(() => product = new Product());

  it('should render as expected', function () {
    const product = new Product();
    const wrapper = shallow(<Search product={product} />);
    expect(wrapper.containsMatchingElement(<input type="text" />)).to.be.true;
  });

  describe('behavior', function () {
    let wrapper: ReactWrapper<any, any>;

    beforeEach(() => wrapper = mount(<Search product={product} />));

    it('should focus and select the search field when pressing ctrl/cmd+f', function () {
      const field = wrapper.ref('prompt').get(0);
      const focusSpy = sandbox.spy();
      const selectSpy = sandbox.spy();

      $(field)
        .focus(focusSpy)
        .select(selectSpy);

      mousetrap.trigger('mod+f');

      expect(focusSpy).has.been.calledOnce;
      expect(selectSpy).has.been.calledOnce;
    });
  });
});
