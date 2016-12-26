import * as React from 'react';
import * as classNames from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { inject } from '../../utils/ioc';
import { UIStore } from '../../stores/UIStore';

interface IStyles {
  resizer: string;
}

const styles = require<IStyles>('./PaneResizer-style.scss');

@observer
export class PaneResizer extends React.Component<{}, any> {
  refs: {
    resizer: HTMLDivElement
  };

  @observable
  hovered: boolean;

  @inject(UIStore)
  uiStore: UIStore;

  @action('set resizer hovered')
  setResizerHovered(value: boolean) {
    this.hovered = value;
  }

  componentDidMount() {
    const window$ = $(window);

    $(this.refs.resizer)
      .on('mousedown', (e) => {
        e.preventDefault();
        this.uiStore.paneResizing.setResizing(true);

        window$
          .on(`mouseup.${PaneResizer.name}`, () => {
            this.uiStore.paneResizing.setResizing(false);
            window$.off(`.${PaneResizer.name}`);
          })
          .on(`mousemove.${PaneResizer.name}`, (e) => {
            this.uiStore.paneResizing.setSplit(e.pageX);
          });
      })
      .on('mouseenter', () => this.setResizerHovered(true))
      .on('mouseleave', () => this.setResizerHovered(false));
  }

  componentWillUnmount() {
    $(window).off(`.${PaneResizer.name}`);
  }

  render() {
    const cls = classNames(
      styles.resizer, {
        active: this.uiStore.paneResizing.resizing || this.hovered,
      }
    );

    return (
      <div ref="resizer" className={cls} style={{ left: this.uiStore.paneResizing.split }}>
        <i className="angle left icon" />
        <div className="line" />
        <i className="angle right icon" />
      </div>
    );
  }
}
