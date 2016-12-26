import { observable, action } from 'mobx';
import { Message, IMessageOptions } from '../models/Message';

export class MessageStore {
  @observable
  messages: Message[] = [];

  @action('add message')
  add(text: string, options?: IMessageOptions): Message {
    const msg = new Message(this, text, options);
    this.messages.push(msg);
    return msg;
  }

  @action('remove message')
  remove(message: Message) {
    const index = this.messages.indexOf(message);
    if (index === -1) {
      throw new Error('The message is not added to the store.');
    }

    this.messages.splice(index, 1);
  }
}
