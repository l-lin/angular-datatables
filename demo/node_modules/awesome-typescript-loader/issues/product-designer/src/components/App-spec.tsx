import * as React from 'react';
import { shallow } from 'enzyme';
import MobxDevTools from 'mobx-react-devtools';

import { iocContainer } from '../utils/ioc';

import { App, DevTools } from './App';
import { ProductListPage } from './pages/ProductListPage';
import { EditorPage } from './pages/EditorPage';

import { Product } from '../models/Product';
import { ProductStore } from '../stores/ProductStore';

describe('App component', function () {
  let store: ProductStore;
  let product: Product;

  beforeEach(function () {
    store = iocContainer.get(ProductStore);
    product = new Product();
  });

  it('should render the product list if no product is selected', function () {
    const wrapper = shallow(<App />);
    expect(wrapper.containsMatchingElement(<ProductListPage />)).to.be.true;
  });

  it('should render the editor if a product is selected', function () {
    store.add(product);
    store.select(product);
    const wrapper = shallow(<App />);
    expect(wrapper.containsMatchingElement(<EditorPage product={product} />)).to.be.true;
  });

  describe('DevTools', function () {
    describe('in production', function () {
      it('App should not render DevTools', function () {
        const wrapper = shallow(<App />);
        expect(wrapper.contains(<DevTools />)).to.be.false;
      });

      it('should render empty', function () {
        const wrapper = shallow(<DevTools />);
        expect(wrapper.children()).to.have.length(0);
      });
    });

    describe('in development', function () {
      before(function () { __DEV__ = true; });
      after(function () { __DEV__ = false; });

      it('App should render DevTools', function () {
        const wrapper = shallow(<App />);
        expect(wrapper.containsMatchingElement(<DevTools/>)).to.be.true;
      });

      it('should render mobx DevTools', function () {
        const wrapper = shallow(<DevTools />);
        expect(wrapper.containsMatchingElement(<MobxDevTools />)).to.be.true;
      });
    });
  });
});
