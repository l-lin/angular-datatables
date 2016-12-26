import * as React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';

import { Modal } from './';

describe('UI - Modal', function () {
  it('should render as expected', function () {
    const wrapper = shallow(<Modal />);
    const expected = <div className="ui modal" />;
    expect(wrapper.equals(expected)).to.be.true;
  });

  it('should render given className as expected', function () {
    const wrapper = shallow(<Modal className="test" />);
    const expected = <div className="ui test modal" />;
    expect(wrapper.equals(expected)).to.be.true;
  });

  it('should render given children as expected', function () {
    const wrapper = shallow(<Modal>foo</Modal>);
    const expected = <div className="ui modal">foo</div>;
    expect(wrapper.equals(expected)).to.be.true;
  });

  describe('behavior', function () {
    let wrapper: ReactWrapper<any, any>;

    afterEach(() => wrapper.unmount());

    it('should not be opened if isOpen is not set', function () {
      const openSpy = sandbox.spy();
      wrapper = mount(<Modal onOpen={openSpy} />);
      expect(openSpy).has.not.been.called;
    });

    it('should open the modal if isOpen is true', function () {
      const openSpy = sandbox.spy();
      wrapper = mount(<Modal isOpen onOpen={openSpy} />);
      expect(openSpy).has.been.calledOnce;
    });

    it('should open if changing isOpen to true', function () {
      const openSpy = sandbox.spy();
      wrapper = mount(<Modal onOpen={openSpy} />);
      wrapper.setProps({ isOpen: true });
      expect(openSpy).has.been.calledOnce;
    });

    it('should close if changing isOpen to false', function () {
      const closeSpy = sandbox.spy();
      wrapper = mount(<Modal isOpen onClose={closeSpy} />);
      wrapper.setProps({ isOpen: false });
      expect(closeSpy).has.been.calledOnce;
    });
  });
});
