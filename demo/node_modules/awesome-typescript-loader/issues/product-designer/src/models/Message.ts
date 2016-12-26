import { action } from 'mobx';
import * as uuid from 'node-uuid';

import { inject } from '../utils/ioc';
import { UIStore } from '../stores/UIStore';
import { MessageStore } from '../stores/MessageStore';

export enum MessageType {
  Information,
  Success,
  Warning,
  Error,
  Loading
}

export interface IMessageOptions {
  type?: MessageType;
  header?: string;
  dismissable?: boolean;
  duration?: number;
  stack?: string;
}

export class Message {
  id: string;
  text: string;
  type: MessageType;
  header?: string;
  dismissable?: boolean;
  duration?: number;
  stack?: string;

  private dismissCancel: () => void;
  private store: MessageStore;

  @inject(UIStore)
  private uiStore: UIStore;

  constructor(store: MessageStore, text: string, options?: IMessageOptions) {
    this.store = store;
    this.id = uuid.v4();
    this.text = text;
    this.type = (options && options.type) || MessageType.Information;

    if (options) {
      this.header = options.header;
      this.dismissable = options.dismissable;
      this.duration = options.duration;
      this.stack = options.stack;
    }

    if (this.duration) {
      this.dismissCancel = this.uiStore.timers.setTimeout(() => this.dismiss(), this.duration);
    }
  }

  @action('dismiss message')
  dismiss() {
    if (this.dismissCancel) {
      this.dismissCancel();
    }

    this.store.remove(this);
  }

  @action('replace message')
  replace(text: string, options?: IMessageOptions) {
    this.store.remove(this);
    this.store.add(text, options);
  }
}
