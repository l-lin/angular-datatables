import * as React from 'react';
import * as moment from 'moment';
import * as classNames from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { inject } from '../../utils/ioc';
import { UIStore } from '../../stores/UIStore';
import { Product } from '../../models/Product';
import { Button } from '../ui';

const style = require<any>('./ProductListItem-style.scss');

interface IProps {
  product: Product;
  onRemove?: (product: Product) => void;
}

@observer
export class ProductListItem extends React.Component<IProps, any> {
  timeLabelIntervalCancel: () => void;

  @inject(UIStore)
  uiStore: UIStore;

  @observable
  timeLabel: string;

  constructor(props: IProps) {
    super(props);

    this.onSelectClick = this.onSelectClick.bind(this);
    this.onDownloadClick = this.onDownloadClick.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  componentWillMount() {
    this.setTimeLabel();
  }

  componentDidMount() {
    this.timeLabelIntervalCancel = this.uiStore.timers.setInterval(() => this.setTimeLabel(), 30000);
  }

  componentWillUnmount() {
    this.timeLabelIntervalCancel();
  }

  @action('update product item time label')
  setTimeLabel() {
    this.timeLabel = moment(this.props.product.lastModified).fromNow();
  }

  onSelectClick(e: React.MouseEvent<any>) {
    e.preventDefault();
    this.props.product.select();
  }

  onDownloadClick() {
    this.props.product.download();
  }

  onRemoveClick() {
    if (!this.props.onRemove) { return; }
    this.props.onRemove(this.props.product);
  }

  render() {
    const {product} = this.props;

    return (
      <div className={classNames(style.item, 'item')}>
        <div className="right floated content">
          <Button ref="download" className="mini basic icon" title="Download" onClick={this.onDownloadClick}>
            <i className="download icon" />
          </Button>
          <Button ref="remove" className="mini basic icon" title="Remove" onClick={this.onRemoveClick}>
            <i className="remove icon" />
          </Button>
        </div>
        <i className="large middle aligned cube icon" />
        <div className="content">
          <a ref="select" className="header" href="#" onClick={this.onSelectClick}>{product.name}</a>
          <div className="description">Last modified {this.timeLabel}</div>
        </div>
      </div>
    );
  }
}
