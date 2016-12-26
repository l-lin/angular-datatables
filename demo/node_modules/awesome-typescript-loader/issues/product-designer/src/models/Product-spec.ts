import { action } from 'mobx';

import { iocContainer } from '../utils/ioc';
import { Product } from './Product';
import { ProductStore } from '../stores/ProductStore';
import { MessageStore } from '../stores/MessageStore';
import { ProductPersister } from '../stores/ProductPersister';

describe('Product model', function () {
  let messageStore: MessageStore;
  let store: ProductStore;
  let productPersister: ProductPersister;

  beforeEach(() => {
    messageStore = iocContainer.get(MessageStore);
    store = iocContainer.get(ProductStore);
    productPersister = iocContainer.get(ProductPersister);
  });

  describe('auto saving', function () {
    let saveSpy: Sinon.SinonSpy;
    let clock: Sinon.SinonFakeTimers;

    beforeEach(() => {
      saveSpy = sandbox.spy(productPersister, 'save');
      clock = sandbox.useFakeTimers();
    });

    it('should auto save on change, with a delay', function () {
      const product = new Product();

      action('change product', () => product.name = 'change 1')();
      action('change product again', () => product.name = 'change 2')();
      clock.tick(Product.autoSaveDelay);

      expect(saveSpy).to.have.been.calledOnce;
      expect(saveSpy.args[0][0].name).to.equal('change 2');
    });

    it('should not auto save when lastModified is changed', function () {
      const product = new Product();

      action('change product', () => product.lastModified = new Date(2016, 1, 1))();
      clock.tick(Product.autoSaveDelay);

      expect(saveSpy).to.not.have.been.called;
    });

    it('should not auto save when deserializing', function () {
      Product.deserialize({ uid: '1234', name: 'foo' });

      clock.tick(Product.autoSaveDelay * 2);
      expect(saveSpy).to.not.have.been.called;
    });
  });

  describe('loading', function () {
    it('should resolve to undefined if given a file that does not end with .product or .prodx', function () {
      const addMessageSpy = sandbox.spy(messageStore, 'add');
      const handle = {
        name: 'invalid',
        read: function (cb: (content: string) => void) { },
      };

      return expect(Product.load(handle)).to.become(undefined).then(() => {
        expect(addMessageSpy).has.been.calledOnce;
      });
    });
  });

  it('should call remove on the attached store when removing', function () {
    const product = store.add('asdf');
    const removeSpy = sandbox.spy(store, 'remove');
    product.remove();
    expect(removeSpy).has.been.calledWith(product);
  });

  it('should call select on the attached store when selecting', function () {
    const product = store.add('asdf');
    const selectSpy = sandbox.spy(store, 'select');
    product.select();
    expect(selectSpy).has.been.calledWith(product);
  });
});
