import * as React from 'react';
import * as classNames from 'classnames';

import 'semantic-ui-css/components/modal.css';
import 'semantic-ui-css/components/modal';

interface IProps {
  className?: string;
  isOpen?: boolean;
  inverted?: boolean;
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  onApprove?: () => void;
  onDeny?: () => void;
}

export class Modal extends React.Component<IProps, any> {
  refs: {
    modal: HTMLDivElement
  };

  private modal$: JQuery;

  componentDidMount() {
    const {isOpen, inverted, onOpen, onOpened, onClose, onClosed, onApprove, onDeny} = this.props;

    this.modal$ = $(this.refs.modal)
      .modal({
        inverted: !!inverted,
        onShow: onOpen || undefined,
        onVisible: onOpened || undefined,
        onHide: onClose || undefined,
        onHidden: onClosed || undefined,
        onApprove: onApprove || undefined,
        onDeny: onDeny || undefined,
      });

    if (__TEST__) {
      this.modal$
        .modal('setting', 'silent', true)
        .modal('setting', 'duration', false);
    }

    if (isOpen) {
      this.modal$.modal('show');
    }
  }

  componentWillUnmount() {
    this.modal$.modal('destroy');
  }

  componentWillUpdate(nextProps: IProps) {
    if (!nextProps.isOpen) {
      this.modal$.modal('hide');
    }
  }

  componentDidUpdate() {
    if (this.props.isOpen) {
      this.modal$.modal('show');
    }
  }

  render() {
    const {className, children} = this.props;

    return (
      <div ref="modal" className={classNames('ui', className, 'modal')}>
        {children}
      </div>
    );
  }
}
