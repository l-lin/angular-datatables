import { iocContainer } from '../utils/ioc';
import { ProductPersister } from './ProductPersister';
import { Product } from '../models/Product';

describe('Product persister', function () {
  let persister: ProductPersister;
  let product: Product;

  beforeEach(function () {
    persister = iocContainer.get(ProductPersister);
    product = new Product();
  });

  describe('saving a product', function () {
    let spy: Sinon.SinonSpy;

    beforeEach(function () {
      spy = sandbox.spy(localStorage, 'setItem');
      persister.save(product);
    });

    it('should write the index', function () {
      expect(spy).to.have.been.calledWith(
        ProductPersister.indexKey,
        JSON.stringify([product.uid])
      );
    });

    it('should write the product to the storage', function () {
      expect(spy).to.have.been.calledWith(
        `${ProductPersister.productKeyPrefix}${product.uid}`,
        JSON.stringify(product.serialize())
      );
    });
  });

  describe('loading products', function () {
    it('should load all saved products', function () {
      sandbox.stub(localStorage, 'getItem')
        .withArgs(`${ProductPersister.productKeyPrefix}${product.uid}`)
        .returns(JSON.stringify(product.serialize()));

      persister.save(product);

      const products = persister.load();
      expect(products.length).to.eq(1);
    });
  });

  describe('removing a product', function () {
    it('should remove the product from storage', function () {
      const setItemSpy = sandbox.spy(localStorage, 'setItem');
      const removeItemSpy = sandbox.spy(localStorage, 'removeItem');

      persister.save(product);
      persister.remove(product);

      expect(setItemSpy).to.have.been.calledWith(ProductPersister.indexKey, JSON.stringify([]));
      expect(removeItemSpy).to.have.been.calledWith(`${ProductPersister.productKeyPrefix}${product.uid}`);
    });
  });
});
