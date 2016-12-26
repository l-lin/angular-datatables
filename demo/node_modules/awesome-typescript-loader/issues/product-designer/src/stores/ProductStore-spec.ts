import { iocContainer } from '../utils/ioc';
import { Product } from '../models/Product';
import { ProductStore } from './ProductStore';

describe('Product store', function () {
  let store: ProductStore;
  let product: Product;

  beforeEach(function () {
    store = iocContainer.get(ProductStore);
    product = new Product();
  });

  describe('creating a product', function () {
    it('should add a product with the given name', function () {
      store.add('foo');
      expect(store.products).to.have.lengthOf(1);
      expect(store.products).to.have.deep.property('[0].name', 'foo');
    });

    it('should return the created product', function () {
      const p = store.add('foo');
      expect(p).to.be.ok;
      expect(p).to.equal(store.products[0]);
    });
  });

  describe('adding a product', function () {
    it('should add the product to the store', function () {
      store.add(product);
      expect(store.products.indexOf(product)).to.be.gt(-1);
    });

    it('should fail if the product is already in the store', function () {
      store.add(product);
      expect(() => store.add(product)).to.throw();
    });

    it('should select the product', function () {
      store.add(product);
      expect(store.selected).to.equal(product);
    });
  });

  describe('removing a product', function () {
    it('should remove the product from the store', function () {
      store.add(product);
      store.remove(product);
      expect(store.products.length).to.equal(0);
    });

    it('should fail if trying to remove a product not in the store', function () {
      expect(() => store.remove(product)).to.throw();
    });
  });

  describe('selecting a product', function () {
    it('should set the product as selected', function () {
      store.add(product);
      store.select(product);
      expect(store.selected).to.eq(product);
    });

    it('should fail if the product is not in the store', function () {
      expect(() => store.select(product)).to.throw();
    });

    it('should remove selection if given "undefined"', function () {
      store.add(product);
      store.select(product);
      store.select(undefined);
      expect(store.selected).to.be.undefined;
    });
  });

  describe('getting products sorted by modification date', function () {
    let clock: Sinon.SinonFakeTimers;
    before(() => clock = sandbox.useFakeTimers());
    after(() => clock.restore());

    it('should return the products in the store sorted by modification date in descending order', function () {
      store.add('1st');
      clock.tick(1000);
      store.add('2nd');
      clock.tick(1000);
      store.add('3rd');
      expect(store.productsOrderedByModificationTime.map(p => p.name)).to.eql(['3rd', '2nd', '1st']);
    });
  });
});
