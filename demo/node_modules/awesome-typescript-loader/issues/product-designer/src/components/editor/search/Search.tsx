import * as React from 'react';
import * as mousetrap from 'mousetrap';

import { Product } from '../../../models/Product';

interface IProps {
  product: Product;
}

export class Search extends React.Component<IProps, any> {
  refs: {
    prompt: HTMLInputElement;
  };

  componentDidMount() {
    mousetrap.bind('mod+f', () => {
      this.refs.prompt.focus();
      this.refs.prompt.select();
      return false;
    });
  }

  componentWillUnmount() {
    mousetrap.unbind('mod+f');
  }

  render() {
    return (
      <div className="ui right aligned category search item">
        <div className="ui transparent icon input">
          <input ref="prompt" className="prompt" type="text" placeholder="Search..." />
          <i className="search icon" />
        </div>
      </div>
    );
  }
}
