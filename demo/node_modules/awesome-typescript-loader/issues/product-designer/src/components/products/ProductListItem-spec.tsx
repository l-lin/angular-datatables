import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { ProductListItem } from './ProductListItem';
import { Product } from '../../models/Product';

describe('Product list item', function () {
  let product: Product;
  let onRemoveSpy: Sinon.SinonSpy;
  let wrapper: ReactWrapper<any, any>;

  beforeEach(() => {
    product = new Product();
    onRemoveSpy = sandbox.spy();
    wrapper = mount(<ProductListItem product={product} onRemove={onRemoveSpy} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render expected refs', function () {
    expect(wrapper.ref('download').get(0)).to.not.be.undefined;
    expect(wrapper.ref('remove').get(0)).to.not.be.undefined;
    expect(wrapper.ref('select').get(0)).to.not.be.undefined;
  });

  it('should call download on the product when clicking download button', function () {
    const downloadStub = sandbox.stub(product, 'download');
    wrapper.ref('download').simulate('click');
    expect(downloadStub).has.been.calledOnce;
  });

  it('should call select on product when select link is clicked', function () {
    const selectStub = sandbox.stub(product, 'select');
    wrapper.ref('select').simulate('click');
    expect(selectStub).has.been.calledOnce;
  });

  it('should call onRemove when remove link is clicked', function () {
    wrapper.ref('remove').simulate('click');
    expect(onRemoveSpy).has.been.calledOnce;
  });

  it('should update the time label every 30 seconds', function () {
    const clock = sandbox.useFakeTimers();
    const setTimeSpy = sandbox.spy(ProductListItem.prototype, 'setTimeLabel');
    wrapper = mount(<ProductListItem product={product} />);

    // should be called once when mounted
    expect(setTimeSpy).has.been.calledOnce;

    // and again after 30 seconds
    clock.tick(30000);
    expect(setTimeSpy).has.been.calledTwice;

    // and again after another 30
    clock.tick(30000);
    expect(setTimeSpy).has.been.calledThrice;
  });
});
