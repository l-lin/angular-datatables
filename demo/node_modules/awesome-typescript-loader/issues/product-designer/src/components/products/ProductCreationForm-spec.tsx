import * as React from 'react';
import { mount } from 'enzyme';

import { iocContainer } from '../../utils/ioc';
import { Product } from '../../models/Product';
import { ProductCreationForm } from './ProductCreationForm';
import { ProductStore } from '../../stores/ProductStore';
import * as fileUpload from '../../helpers/fileUpload';
import { FileDialog } from '../ui';

describe('Product creation form', function () {
  let store: ProductStore;

  beforeEach(() => store = iocContainer.get(ProductStore));

  it('should render as expected', function () {
    const wrapper = mount(<ProductCreationForm />);

    expect(wrapper.ref('form').get(0)).to.not.be.undefined;
    expect(wrapper.ref('browseFile').get(0)).to.not.be.undefined;
    expect(wrapper.ref('productName').get(0)).to.not.be.undefined;
    expect(wrapper.ref('createButton').get(0)).to.not.be.undefined;
  });

  it('should submit the form when create button is clicked', function () {
    const wrapper = mount(<ProductCreationForm />);
    const form = wrapper.ref('form').get(0);
    const submitSpy = sandbox.spy(form, 'submit');

    wrapper.ref('createButton').simulate('click');

    expect(submitSpy).has.been.calledOnce;
  });

  it('should not call add on store if no name is given', function () {
    const wrapper = mount(<ProductCreationForm />);
    const addSpy = sandbox.spy(store, 'add');

    wrapper.ref('createButton').simulate('click');

    expect(addSpy).has.not.been.called;
  });

  it('should call add on store with a new product if name is given', function () {
    const wrapper = mount(<ProductCreationForm />);
    const addSpy = sandbox.spy(store, 'add');

    const nameField = wrapper.ref('productName').get(0) as any;
    nameField.value = 'foo';
    wrapper.ref('createButton').simulate('click');

    expect(addSpy).has.been.calledOnce;
    expect(addSpy.args[0][0].name).to.equal('foo');
  });

  it('should show the file browser when clicking the browseFile link and close again immediately', function () {
    const wrapper = mount(<ProductCreationForm />);
    const clock = sandbox.useFakeTimers();

    wrapper.ref('browseFile').simulate('click');

    const instance = wrapper.instance() as ProductCreationForm;
    expect(instance.fileDialogOpen).to.be.true;

    clock.tick(1);
    expect(instance.fileDialogOpen).to.be.false;
  });

  it('should call the onFileUpload handler when FileDialog changes', function () {
    const loadStub = sandbox.stub(Product, 'load').returns(Promise.resolve(new Product()));
    const wrapper = mount(<ProductCreationForm />);
    wrapper.ref('browseFile').simulate('click');

    const fileInput = $(wrapper.find(FileDialog).find('input').get(0));
    const fileHandle = { name: 'foo' };
    sandbox.stub(fileUpload, 'readFileInput').returns(fileHandle);

    fileInput.change();

    expect(loadStub).has.been.calledWith(fileHandle);
  });
});
