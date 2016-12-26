import { MessageStore } from './MessageStore';
import { Message } from '../models/Message';

describe('Message store', function () {
  describe('adding a message', function () {
    it('should add the message to the store', function () {
      const store = new MessageStore();
      store.add('test');
      expect(store.messages.length).to.equal(1);
    });

    it('should create the message with expected parameters', function () {
      const store = new MessageStore();
      const msg = store.add('test', { header: 'header' });
      expect(msg.text).to.equal('test');
      expect(msg.header).to.equal('header');
    });
  });

  describe('removing a message', function () {
    it('should remove the message from the store', function () {
      const store = new MessageStore();
      const msg = store.add('test');
      store.remove(msg);
      expect(store.messages.length).to.equal(0);
    });

    it('should fail if the message is not in the store', function () {
      const store = new MessageStore();
      const msg = new Message(store, 'test');
      expect(() => store.remove(msg)).to.throw();
    });
  });
});
