import * as React from 'react';
import { shallow, mount } from 'enzyme';

import { iocContainer } from '../../utils/ioc';
import { MessageType } from '../../models/Message';
import { MessageStore } from '../../stores/MessageStore';
import { MessageItem } from './MessageItem';

describe('Message item', function () {
  let store: MessageStore;

  beforeEach(() => store = iocContainer.get(MessageStore));

  describe('rendering', function () {
    describe('message class', function () {
      it('should have expected class when info message', function () {
        const msg = store.add('test');
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.prop('className')).to.contain('info message');
      });

      it('should have expected class when loading', function () {
        const msg = store.add('test', { type: MessageType.Loading });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.prop('className')).to.contain('info message');
      });

      it('should have expected class when success', function () {
        const msg = store.add('test', { type: MessageType.Success });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.prop('className')).to.contain('positive message');
      });

      it('should have expected class when error', function () {
        const msg = store.add('test', { type: MessageType.Error });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.prop('className')).to.contain('negative message');
      });

      it('should have expected class when warning', function () {
        const msg = store.add('test', { type: MessageType.Warning });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.prop('className')).to.contain('warning message');
      });
    });

    describe('dismiss', function () {
      it('should not have a dismiss icon when not dismissable', function () {
        const msg = store.add('test');
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="close icon" />)).to.be.false;
      });

      it('should have a dismiss icon when dismissable', function () {
        const msg = store.add('test', { dismissable: true });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="close icon" />)).to.be.true;
      });
    });

    describe('icon', function () {
      it('should show a spinner when loading', function () {
        const msg = store.add('test', { type: MessageType.Loading });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="spinner loading icon" />)).to.be.true;
      });

      it('should show info icon when info message', function () {
        const msg = store.add('test', { type: MessageType.Information });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="info circle icon" />)).to.be.true;
      });

      it('should show frown icon when error message', function () {
        const msg = store.add('test', { type: MessageType.Error });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="frown icon" />)).to.be.true;
      });

      it('should show success icon when success message', function () {
        const msg = store.add('test', { type: MessageType.Success });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="success icon" />)).to.be.true;
      });

      it('should show warning icon when warning message', function () {
        const msg = store.add('test', { type: MessageType.Warning });
        const wrapper = shallow(<MessageItem message={msg} />);
        expect(wrapper.containsMatchingElement(<i className="warning sign icon" />)).to.be.true;
      });
    });

    it('should render the header if given', function () {
      const msg = store.add('test', { header: 'header' });
      const wrapper = shallow(<MessageItem message={msg} />);
      expect(wrapper.containsMatchingElement(<div className="header">{msg.header}</div>)).to.be.true;
    });

    it('should not render the header if not given', function () {
      const msg = store.add('test');
      const wrapper = shallow(<MessageItem message={msg} />);
      expect(wrapper.containsMatchingElement(<div className="header">{msg.header}</div>)).to.be.false;
    });

    it('should render the message text', function () {
      const msg = store.add('test');
      const wrapper = shallow(<MessageItem message={msg} />);
      expect(wrapper.containsMatchingElement(<div>{msg.text}</div>)).to.be.true;
    });

    it('should render the message stack if given', function () {
      const msg = store.add('test', { stack: 'asdf' });
      const wrapper = shallow(<MessageItem message={msg} />);
      expect(wrapper.containsMatchingElement(<pre>{msg.stack}</pre>)).to.be.true;
    });

    it('should not render the message stack if not given', function () {
      const msg = store.add('test');
      const wrapper = shallow(<MessageItem message={msg} />);
      expect(wrapper.containsMatchingElement(<pre>{msg.stack}</pre>)).to.be.false;
    });
  });

  it('should dismiss the message when dismiss link is clicked', function () {
    const msg = store.add('test', { dismissable: true });
    const wrapper = mount(<MessageItem message={msg} />);
    const dismissSpy = sandbox.spy(msg, 'dismiss');
    wrapper.ref('dismiss').simulate('click');
    expect(dismissSpy).has.been.calledOnce;
  });
});
