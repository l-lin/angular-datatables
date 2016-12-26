import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as mousetrap from 'mousetrap';

import { Modal, Button } from '../ui';
import { Product } from '../../models/Product';

interface IProps {
  product?: Product;
  onClosed?: () => void;
  onApprove?: () => void;
}

export class RemoveProductModal extends React.Component<IProps, any> {
  refs: {
    ok: Button;
  };

  componentDidMount() {
    if (this.props.product) { this.bindEnter(); }
  }

  componentDidUpdate() {
    this.props.product ? this.bindEnter() : this.unbindEnter();
  }

  componentWillUnmount() {
    this.unbindEnter();
  }

  bindEnter() {
    mousetrap.bind('enter', () => {
      $(ReactDOM.findDOMNode(this.refs.ok)).click();
    });
  }

  unbindEnter() {
    mousetrap.unbind('enter');
  }

  render() {
    const {product, onClosed, onApprove} = this.props;
    return (
      <Modal className="small" isOpen={!!product} onClosed={onClosed} onApprove={onApprove}>
        <div className="ui header">
          Remove product "{product && product.name}"
        </div>
        <div className="content">
          Are you sure you wish to remove this product?
        </div>
        <div className="actions">
          <Button className="cancel red inverted">
            <i className="remove icon" /> No
          </Button>
          <Button ref="ok" className="ok green inverted">
            <i className="checkmark icon" /> Yes
          </Button>
        </div>
      </Modal>
    );
  }
}
