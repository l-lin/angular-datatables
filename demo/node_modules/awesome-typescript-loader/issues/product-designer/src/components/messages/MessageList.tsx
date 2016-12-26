import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { observer } from 'mobx-react';

import { inject } from '../../utils/ioc';
import { MessageItem } from './MessageItem';
import { MessageStore } from '../../stores/MessageStore';

const style = require<any>('./MessageList-style.scss');

@observer
export class MessageList extends React.Component<{}, any> {
  @inject(MessageStore)
  messageStore: MessageStore;

  render() {
    return (
      <div className={style.list}>
        <ReactCSSTransitionGroup transitionName="message-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {this.messageStore.messages.map(msg =>
            <MessageItem key={msg.id} message={msg} />
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
