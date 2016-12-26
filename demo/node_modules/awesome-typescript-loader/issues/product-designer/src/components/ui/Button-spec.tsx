import * as React from 'react';
import { shallow } from 'enzyme';

import { Button } from './Button';

describe('UI - Button', function () {
  describe('rendering', function () {
    it('should render as expected with no given props', function () {
      const wrapper = shallow(<Button />);
      const expected = <div className="ui button" />;
      expect(wrapper.equals(expected)).to.be.true;
    });

    it('should render as disabled when given disabled prop', function () {
      const wrapper = shallow(<Button disabled={true} />);
      const expected = <div className="ui disabled button" disabled={true} />;
      expect(wrapper.equals(expected)).to.be.true;
    });

    it('should include given className in class', function () {
      const wrapper = shallow(<Button className="test" />);
      const expected = <div className="ui test button" />;
      expect(wrapper.equals(expected)).to.be.true;
    });

    it('should render given children', function () {
      const wrapper = shallow(<Button>foo</Button>);
      const expected = <div className="ui button">foo</div>;
      expect(wrapper.equals(expected)).to.be.true;
    });
  });

  describe('behavior', function () {
    it('should call given onClick handler when button is clicked', function () {
      const spy = sandbox.spy();
      shallow(<Button onClick={spy} />).simulate('click');
      expect(spy).to.have.been.calledOnce;
    });
  });
});
