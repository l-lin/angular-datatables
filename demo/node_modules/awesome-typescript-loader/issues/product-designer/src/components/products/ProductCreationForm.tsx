import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import { inject } from '../../utils/ioc';
import { Form, Button, FileDialog } from '../ui';
import { Product } from '../../models/Product';
import { ProductStore } from '../../stores/ProductStore';
import { IFileHandle } from '../../helpers/fileUpload';

const schema = {
  name: {
    identifier: 'product_name',
    rules: [
      {
        type: 'empty',
        prompt: 'You must specify a product name',
      },
    ],
  },
};

@observer
export class ProductCreationForm extends React.Component<{}, any> {
  @inject(ProductStore)
  productStore: ProductStore;

  @observable
  fileDialogOpen: boolean;

  refs: {
    form: Form;
    productName: HTMLInputElement;
  };

  constructor() {
    super();
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFileBrowse = this.onFileBrowse.bind(this);
    this.onFileDialogChange = this.onFileDialogChange.bind(this);
    this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
  }

  onFormSubmit() {
    this.productStore.add(new Product(this.refs.productName.value));
  }

  @action('open file browser')
  onFileBrowse(e: React.MouseEvent<any>) {
    e.preventDefault();
    this.fileDialogOpen = true;

    setTimeout(action('hide file browser', () => this.fileDialogOpen = false));
  }

  onFileUpload(handle: IFileHandle | undefined) {
    if (handle) {
      Product.load(handle)
        .then(p => {
          if (p) {
            this.productStore.add(p);
          }
        });
    }
  }

  onFileDialogChange(handle: IFileHandle) {
    this.onFileUpload(handle);
  }

  onCreateButtonClick() {
    this.refs.form.submit();
  }

  render() {
    return (
      <Form ref="form" schema={schema} onSubmit={this.onFormSubmit}>
        <div className="ui small attached info message">
          <i className="info icon" />
          Drop .product files on the list to import, <a ref="browseFile" href="#" onClick={this.onFileBrowse}>or click here to browse</a>.
          <FileDialog isOpen={this.fileDialogOpen} onChange={this.onFileDialogChange} />
        </div>
        <div className="ui attached message">
          <div className="field">
            <input ref="productName" name="product_name" placeholder="Product name" className="ui input" />
          </div>
          <Button ref="createButton" className="large fluid green labeled icon" onClick={this.onCreateButtonClick}>
            <i className="plus icon" />
            Create product
          </Button>
        </div>
        <div className="ui bottom attached small error message" />
      </Form>
    );
  }
}
