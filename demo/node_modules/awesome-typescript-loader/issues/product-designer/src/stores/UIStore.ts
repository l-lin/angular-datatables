import { observable, action, asStructure } from 'mobx';

interface ICancelable {
  (): void;
}

export class UIStore {
  @observable
  windowDimensions = asStructure({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  timers = new Timers();
  paneResizing = new PaneResizing();

  constructor() {
    $(window).resize(action('window resize', () => {
      this.windowDimensions.width = window.innerWidth;
      this.windowDimensions.height = window.innerHeight;
    }));
  }
}

class PaneResizing {
  readonly MIN_PANE_SPLIT = 200;
  readonly MAX_PANE_SPLIT = 350;

  @observable
  resizing: boolean;

  @observable
  split = 250;

  @action('set pane resizing')
  setResizing(value: boolean) {
    this.resizing = value;
  }

  @action('set pane split')
  setSplit(value: number) {
    if (isNaN(value) || value < this.MIN_PANE_SPLIT) {
      value = this.MIN_PANE_SPLIT;
    } else if (value > this.MAX_PANE_SPLIT) {
      value = this.MAX_PANE_SPLIT;
    }

    this.split = value;
  }
}

class Timers {
  intervals: number[] = [];
  timeouts: number[] = [];

  setInterval(handler: () => void, timeout: number): ICancelable {
    const h = setInterval(handler, timeout);
    this.intervals.push(h);
    return () => {
      clearInterval(h);
      this.intervals.splice(this.intervals.indexOf(h), 1);
    };
  }

  setTimeout(handler: () => void, timeout: number): ICancelable {
    let h: number;
    h = setTimeout(() => {
      this.timeouts.splice(this.timeouts.indexOf(h), 1);
      handler();
    }, timeout);

    this.timeouts.push(h);

    return () => {
      clearTimeout(h);
      this.timeouts.splice(this.timeouts.indexOf(h), 1);
    };
  }

  cancelIntervals() {
    this.intervals.forEach(h => clearInterval(h));
  }

  cancelTimeouts() {
    this.timeouts.forEach(h => clearTimeout(h));
  }

  cancelAll() {
    this.cancelIntervals();
    this.cancelTimeouts();
  }
}
