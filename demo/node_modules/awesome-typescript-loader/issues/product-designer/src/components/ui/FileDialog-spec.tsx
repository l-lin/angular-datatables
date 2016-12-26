import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import { FileDialog, IFileDialogProps } from './';
import * as fileUpload from '../../helpers/fileUpload';

describe('UI - File dialog', function () {
  describe('rendering', function () {
    it('should render as an empty div if not open', function () {
      const wrapper = shallow(<FileDialog isOpen={false} />);
      expect(wrapper.matchesElement(<div />)).to.be.true;
    });

    it('should render a hidden file dialog if open', function () {
      const wrapper = shallow(<FileDialog isOpen={true} />);
      expect(wrapper.matchesElement(<div><input type="file" style={{ display: 'none' }} /></div>)).to.be.true;
    });

    describe('opening the file dialog', function () {
      it('should click the file input when mounted as open', function () {
        const wrapper = mount(<FileDialog isOpen={true} />);
        const input = $(ReactDOM.findDOMNode(wrapper.instance())).find('input');
        const clickSpy = sandbox.spy();
        input.click(clickSpy);
        wrapper.mount();

        expect(clickSpy).to.have.been.calledOnce;
      });

      it('should click the file input when switching to open', function () {
        const wrapper = mount<IFileDialogProps, void>(<FileDialog isOpen={false} />);
        const input = $(ReactDOM.findDOMNode(wrapper.instance()));
        const clickSpy = sandbox.spy();
        input.click(clickSpy);
        wrapper.setProps({ isOpen: true });

        expect(clickSpy).to.have.been.calledOnce;
      });
    });

    it('should call the onChange handler when a file is selected', function () {
      const changeSpy = sandbox.spy();
      const wrapper = mount<IFileDialogProps, void>(<FileDialog isOpen={true} onChange={changeSpy} />);
      const input = $(ReactDOM.findDOMNode(wrapper.instance())).find('input');

      const fileHandle = { foo: 'bar' };
      sandbox.stub(fileUpload, 'readFileInput').returns(fileHandle);

      input.change();

      expect(changeSpy).to.have.been.calledWith(fileHandle);
    });
  });
});
