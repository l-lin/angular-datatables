import { iocContainer } from '../utils/ioc';
import { Message, MessageType } from './Message';
import { MessageStore } from '../stores/MessageStore';

describe('Message', function () {
  let store: MessageStore;

  beforeEach(() => {
    store = iocContainer.get(MessageStore);
  });

  it('should set type to information by defaul', function () {
    const msg = new Message(store, 'text');
    expect(msg.type).to.equal(MessageType.Information);
  });

  it('should apply give options as expected', function () {
    const msg = new Message(store, 'text', {
      type: MessageType.Warning,
      header: 'header',
      dismissable: true,
      duration: 500,
      stack: 'stack',
    });

    expect(msg.text).to.equal('text');
    expect(msg.type).to.equal(MessageType.Warning);
    expect(msg.header).to.equal('header');
    expect(msg.dismissable).to.equal(true);
    expect(msg.duration).to.equal(500);
    expect(msg.stack).to.equal('stack');
  });

  describe('dismissing a message', function () {
    it('should remove the message from the store', function () {
      const msg = store.add('test');
      const removeSpy = sandbox.spy(store, 'remove');
      msg.dismiss();
      expect(removeSpy).has.been.calledWith(msg);
    });
  });

  describe('replacing a message', function () {
    it('should remove the message from the store, and add a new', function () {
      const msg = store.add('test');
      const removeSpy = sandbox.spy(store, 'remove');
      const addSpy = sandbox.spy(store, 'add');

      msg.replace('new msg', { header: 'new header' });
      expect(removeSpy).has.been.calledWith(msg);
      expect(addSpy).has.been.calledWith('new msg', { header: 'new header' });
    });
  });

  it('should automatically dismiss the message if duration is set', function () {
    const clock = sandbox.useFakeTimers();
    const msg = store.add('test', { duration: 1000 });
    const dismissSpy = sandbox.spy(msg, 'dismiss');

    clock.tick(1000);
    expect(dismissSpy).has.been.calledOnce;
  });
});
