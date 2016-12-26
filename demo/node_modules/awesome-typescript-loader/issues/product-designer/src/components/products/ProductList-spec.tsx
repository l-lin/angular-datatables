import * as React from 'react';
import { shallow, mount } from 'enzyme';

import { iocContainer } from '../../utils/ioc';
import { ProductStore } from '../../stores/ProductStore';
import { ProductList } from './ProductList';
import { ProductListItem } from './ProductListItem';
import * as fileUpload from '../../helpers/fileUpload';
import { Product } from '../../models/Product';

describe('Product list', function () {
  let store: ProductStore;

  beforeEach(() => store = iocContainer.get(ProductStore));

  it('should render each product ordered by modification time', function () {
    const clock = sandbox.useFakeTimers();

    const first = store.add('1st');
    clock.tick(1000);
    const second = store.add('2nd');
    clock.tick(1000);
    const third = store.add('3rd');

    const wrapper = shallow(<ProductList />);
    const listItems = wrapper.find(ProductListItem);

    expect(listItems.length).to.equal(3);
    expect(listItems.at(0).matchesElement(<ProductListItem product={third} />)).to.be.true;
    expect(listItems.at(1).matchesElement(<ProductListItem product={second} />)).to.be.true;
    expect(listItems.at(2).matchesElement(<ProductListItem product={first} />)).to.be.true;
  });

  it('should set the drag over property to true when drag-drop enters', function () {
    const wrapper = mount(<ProductList />);
    const instance = wrapper.instance() as ProductList;
    $(wrapper.ref('main').get(0)).trigger('dragenter');
    expect(instance.isDragDropOver).to.be.true;
  });

  it('should set drag over property to false when drop-drop leaves', function () {
    const wrapper = mount(<ProductList />);
    const instance = wrapper.instance() as ProductList;
    const mainDiv = wrapper.ref('main').get(0);

    $(mainDiv)
      .trigger('dragenter')
      .trigger('dragover') // for coverage
      .trigger('dragleave');

    expect(instance.isDragDropOver).to.be.false;
  });

  it('should call readFileInput when dropping on the list and in turn Product.load', function () {
    const product = new Product();

    const wrapper = mount(<ProductList />);
    const mainDiv = wrapper.ref('main').get(0);

    const fileHandle = { name: 'foo' };
    const readFileStub = sandbox.stub(fileUpload, 'readFileDropEvent').returns(fileHandle);
    const promise = Promise.resolve(product);
    const loadProductStub = sandbox.stub(Product, 'load').returns(promise);
    const addProductSpy = sandbox.spy(store, 'add');

    $(mainDiv).trigger('drop');
    return promise.then(function () {
      expect(readFileStub).has.been.calledOnce;
      expect(loadProductStub).has.been.calledWith(fileHandle);
      expect(addProductSpy).has.been.calledOnce;
    });
  });

  describe('removal', function () {
    it('should set the product for renewal when a product item is being removed', function () {
      const product = store.add('foo');
      const wrapper = mount(<ProductList />);
      const list = wrapper.instance() as ProductList;

      const listItem = wrapper.find(ProductListItem);
      listItem.find('Button').at(1).simulate('click');

      expect(list.productToRemove).to.equal(product);
    });

    it('should remove the product when clicking ok in the modal', function () {
      const product = store.add('foo');
      const removeSpy = sandbox.spy(product, 'remove');
      const wrapper = mount(<ProductList />);

      const list = wrapper.instance() as ProductList;
      const listItem = wrapper.find(ProductListItem);
      listItem.find('Button').at(1).simulate('click');

      const modal = wrapper.find('RemoveProductModal');

      modal.prop('onApprove')();
      expect(removeSpy).has.been.calledOnce;

      modal.prop('onClosed')();
      expect(list.productToRemove).to.be.undefined;
    });
  });
});
