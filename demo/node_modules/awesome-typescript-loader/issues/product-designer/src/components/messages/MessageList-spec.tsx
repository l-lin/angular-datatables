import * as React from 'react';
import { shallow } from 'enzyme';

import { iocContainer } from '../../utils/ioc';
import { MessageStore } from '../../stores/MessageStore';
import { MessageList } from './MessageList';
import { MessageItem } from './MessageItem';

describe('Message list', function () {
  it('should render messages as expected', function () {
    const store = iocContainer.get(MessageStore);
    const first = store.add('first');
    const second = store.add('second');
    const third = store.add('third');

    const wrapper = shallow(<MessageList />);
    const messages = wrapper.find(MessageItem);

    expect(messages.length).to.equal(3);
    expect(messages.at(0).matchesElement(<MessageItem message={first} />)).to.be.true;
    expect(messages.at(1).matchesElement(<MessageItem message={second} />)).to.be.true;
    expect(messages.at(2).matchesElement(<MessageItem message={third} />)).to.be.true;
  });
});
