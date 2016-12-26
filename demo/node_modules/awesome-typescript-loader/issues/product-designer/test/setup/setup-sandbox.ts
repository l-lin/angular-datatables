import { iocContainer } from '../../src/utils/ioc';
import { UIStore } from '../../src/stores/UIStore';

declare var global: any;

export function _beforeEach() {
  global.sandbox = sinon.sandbox.create();
  iocContainer.snapshot();
}

export function _afterEach() {
  sandbox.restore();
  iocContainer.get(UIStore).timers.cancelAll();
  iocContainer.restore();
  localStorage.clear();
  sessionStorage.clear();
}

if (global.beforeEach) { beforeEach(_beforeEach); }
if (global.afterEach) { afterEach(_afterEach); }
