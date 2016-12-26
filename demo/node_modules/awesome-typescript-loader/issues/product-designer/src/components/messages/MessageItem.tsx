import * as React from 'react';
import * as classNames from 'classnames';

import { Message, MessageType } from '../../models/Message';

const style = require<any>('./MessageItem-style.scss');

interface IProps {
  message: Message;
}

export class MessageItem extends React.Component<IProps, any> {
  constructor() {
    super();

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.props.message.dismiss();
  }

  private get className() {
    const {message} = this.props;
    return classNames(
      'ui', 'small', 'compact', 'icon',
      {
        info: message.type === MessageType.Information || message.type === MessageType.Loading,
        positive: message.type === MessageType.Success,
        negative: message.type === MessageType.Error,
        warning: message.type === MessageType.Warning,
      },
      style.message,
      'message');
  }

  private get iconClassName() {
    const {message} = this.props;
    return classNames({
      'spinner loading': message.type === MessageType.Loading,
      'info circle': message.type === MessageType.Information,
      frown: message.type === MessageType.Error,
      success: message.type === MessageType.Success,
      'warning sign': message.type === MessageType.Warning,
    }, 'icon');
  }

  render() {
    const {message} = this.props;

    return (
      <div className={this.className}>
        {message.dismissable ? <i ref="dismiss" className="close icon" onClick={this.onDismiss} /> : undefined}
        <i className={this.iconClassName} />
        <div className="content">
          {message.header ? <div className="header">{message.header}</div> : undefined}
          <div>{message.text}</div>
          {message.stack ? <pre>{message.stack}</pre> : undefined}
        </div>
      </div>
    );
  }
}
