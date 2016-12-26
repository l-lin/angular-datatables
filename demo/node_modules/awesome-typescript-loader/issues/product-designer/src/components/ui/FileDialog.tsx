import * as React from 'react';
import { readFileInput, IFileHandle } from '../../helpers/fileUpload';

export interface IFileDialogProps {
  isOpen: boolean;
  onChange?: (handle: IFileHandle | undefined) => void;
}

export class FileDialog extends React.Component<IFileDialogProps, any> {
  refs: {
    input: HTMLInputElement,
  };

  componentDidMount() {
    this.clickInput();
  }

  componentDidUpdate() {
    this.clickInput();
  }

  render() {
    return (
      <div>
        {this.props.isOpen ? <input ref="input" type="file" style={{ display: 'none' }} /> : undefined}
      </div>
    );
  }

  private clickInput() {
    if (!this.props.isOpen) {
      return;
    }

    const self = this;
    const input = this.refs.input;
    $(input)
      .on('change', function() {
        const handle = readFileInput(input);
        if (self.props.onChange) {
          self.props.onChange(handle);
        }
      })
      .click();
  }
}
