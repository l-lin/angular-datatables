import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import { Form } from './Form';

describe('UI - Form', function () {
  describe('rendering', function () {
    it('should render as expected with no props', function () {
      const wrapper = shallow(<Form />);
      const expected = <form className="ui form" />;
      expect(wrapper.equals(expected)).to.be.true;
    });

    it('should render given className in the class', function () {
      const wrapper = shallow(<Form className="test" />);
      const expected = <form className="ui test form" />;
      expect(wrapper.equals(expected)).to.be.true;
    });

    it('should render given children', function () {
      const wrapper = shallow(<Form>foo</Form>);
      const expected = <form className="ui form">foo</form>;
      expect(wrapper.equals(expected)).to.be.true;
    });
  });

  describe('behavior', function () {
    it('should call the onSubmit handler when form is submitted', function () {
      const spy = sandbox.spy();
      const wrapper = mount(<Form onSubmit={spy} />);

      // trigger submit
      $(ReactDOM.findDOMNode(wrapper.instance())).trigger('submit');
      expect(spy).to.have.been.calledOnce;
    });

    it('should prevent default submit behavior', function () {
      const spy = sandbox.spy();
      const wrapper = mount(<Form onSubmit={spy} />);

      // trigger submit
      $(ReactDOM.findDOMNode(wrapper.instance())).trigger('submit');

      const event = spy.args[0][0] as JQueryEventObject;
      expect(event.isDefaultPrevented()).to.be.true;
    });

    it('should submit the form when submit is called', function () {
      const spy = sandbox.spy();
      const wrapper = mount(<Form onSubmit={spy} />);
      const form = (wrapper.instance() as any) as Form;

      form.submit();
      expect(spy).to.have.been.calledOnce;
    });

    describe('schema validation', function () {
      const schema = {
        foo: 'empty',
      };

      it('should call the onSubmit handler when form is submitted and is valid', function () {
        const spy = sandbox.spy();
        const wrapper = mount(<Form onSubmit={spy} schema={schema}><input type="text" name="foo" defaultValue="bar" /></Form>);

        // trigger submit
        $(ReactDOM.findDOMNode(wrapper.instance())).trigger('submit');

        expect(spy).to.have.been.calledOnce;
      });

      it('should not call onSubmit if the form is invalid', function () {
        const spy = sandbox.spy();
        const wrapper = mount(<Form onSubmit={spy} schema={schema}><input type="text" name="foo" /></Form>);

        // trigger submit
        $(ReactDOM.findDOMNode(wrapper.instance())).trigger('submit');

        expect(spy).to.not.have.been.called;
      });

      it('should be considered valid when schema is upheld', function () {
        const spy = sandbox.spy();
        const wrapper = mount(<Form onSubmit={spy} schema={schema}><div className="field"><input type="text" name="foo" defaultValue="bar" /></div></Form>);
        const form = (wrapper.instance() as any) as Form;

        expect(form.isValid()).to.be.true;
      });

      it('should be considered invalid when schema is not upheld', function () {
        const spy = sandbox.spy();
        const wrapper = mount(<Form onSubmit={spy} schema={schema}><input type="text" name="foo" /></Form>);
        const form = (wrapper.instance() as any) as Form;

        expect(form.isValid()).to.be.false;
      });
    });
  });
});
