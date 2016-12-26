import { iocContainer } from '../utils/ioc';
import { UIStore } from './UIStore';

const wnd = window as any;

describe('UI Store', function () {
  let store: UIStore;

  beforeEach(() => store = iocContainer.get(UIStore));

  afterEach(() => {
    wnd.innerWidth = 1024;
    wnd.innerHeight = 768;
  });

  it('should have window dimensions', function () {
    expect(store.windowDimensions.width).to.eq(1024);
    expect(store.windowDimensions.height).to.eq(768);
  });

  it('should update window dimensions on resize', function () {
    wnd.innerWidth = 1920;
    wnd.innerHeight = 1080;
    $(window).trigger('resize');

    expect(store.windowDimensions.width).to.eq(1920);
    expect(store.windowDimensions.height).to.eq(1080);
  });

  describe('Pane resizing', function () {
    it('should fallback to min value if below bounds', function () {
      store.paneResizing.setSplit(0);
      expect(store.paneResizing.split).to.equal(store.paneResizing.MIN_PANE_SPLIT);
    });

    it('should fallback to min value if NaN', function () {
      store.paneResizing.setSplit(NaN);
      expect(store.paneResizing.split).to.equal(store.paneResizing.MIN_PANE_SPLIT);
    });

    it('should fallback to max value if over bounds', function () {
      store.paneResizing.setSplit(999);
      expect(store.paneResizing.split).to.equal(store.paneResizing.MAX_PANE_SPLIT);
    });
  });
});
