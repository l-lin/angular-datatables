import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as mousetrap from 'mousetrap';

import { RemoveProductModal } from './RemoveProductModal';
import { Product } from '../../models/Product';

describe('Remove product modal', function () {
  let wrapper: ReactWrapper<any, any>;
  let approveSpy: Sinon.SinonSpy;

  beforeEach(() => {
    approveSpy = sandbox.spy();
    wrapper = mount(<RemoveProductModal product={new Product()} onApprove={approveSpy} />)
  });

  afterEach(() => wrapper.unmount());

  it('should click the ok button when pressing enter', function () {
    mousetrap.trigger('enter');
    expect(approveSpy).has.been.calledOnce;
  });
});
