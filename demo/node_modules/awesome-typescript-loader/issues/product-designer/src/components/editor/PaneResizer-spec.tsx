import * as React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';

import { iocContainer } from '../../utils/ioc';
import { PaneResizer } from './PaneResizer';
import { UIStore } from '../../stores/UIStore';

describe('Pane resizer', function () {
  let uiStore: UIStore;

  beforeEach(() => uiStore = iocContainer.get(UIStore));

  it('should be able to render', function () {
    shallow(<PaneResizer />);
  });

  describe('behavior', function () {
    let wrapper: ReactWrapper<any, {}>;

    beforeEach(() => wrapper = mount(<PaneResizer />));
    afterEach(() => wrapper.unmount());

    it('should appear hovered when the mouse enters', function () {
      const instance = wrapper.instance() as PaneResizer;

      $(wrapper.ref('resizer').get(0)).trigger('mouseenter');
      expect(instance.hovered).to.be.true;
    });

    it('should not appear hovered when the mouse leaves again', function () {
      const instance = wrapper.instance() as PaneResizer;

      $(wrapper.ref('resizer').get(0))
        .trigger('mouseenter')
        .trigger('mouseleave');

      expect(instance.hovered).to.be.false;
    });

    it('should begin resizing when the mouse is clicked on the resizer', function () {
      $(wrapper.ref('resizer').get(0))
        .trigger('mousedown');

      expect(uiStore.paneResizing.resizing).to.be.true;
    });

    it('should stop resizing when the mouse is released anywhere on the window', function () {
      $(wrapper.ref('resizer').get(0))
        .trigger('mousedown');

      $(window).trigger('mouseup');

      expect(uiStore.paneResizing.resizing).to.be.false;
    });

    it('should set the pane split when moving the mouse on the window while resizing', function () {
      const spy = sandbox.spy(uiStore.paneResizing, 'setSplit');

      $(wrapper.ref('resizer').get(0))
        .trigger('mousedown');

      $(window).trigger(jQuery.Event('mousemove', { pageX: 200 }));

      expect(spy).has.been.calledWith(200);
    });

    it('should not attempt to stop resizing when mouse is released while not resizing', function () {
      const spy = sandbox.spy(uiStore.paneResizing, 'setResizing');

      $(window).trigger('mouseup');

      expect(spy).has.not.been.called;
    });

    it('should not attempt to set pane split when moving mouse on window while not resizing', function () {
      const spy = sandbox.spy(uiStore.paneResizing, 'setSplit');

      $(window).trigger('mousemove');

      expect(spy).has.not.been.called;
    });
  });
});
