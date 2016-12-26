import * as React from 'react';
import * as classNames from 'classnames';

import 'semantic-ui-css/components/form.css';
import 'semantic-ui-css/components/form';

interface IProps {
  className?: string;
  schema?: any;
  onSubmit?: (event: JQueryEventObject) => void;
}

export class Form extends React.Component<IProps, any> {
  refs: {
    form: HTMLFormElement
  };

  private form$: JQuery;

  componentDidMount() {
    const {schema, onSubmit} = this.props;

    this.form$ = $(this.refs.form).on('submit', e => e.preventDefault());

    if (schema) {
      this.form$
        .form({
          fields: schema,
          onSuccess: onSubmit,
        });
    } else if (onSubmit) {
      this.form$.on('submit', e => {
        onSubmit(e);
      });
    }
  }

  isValid() {
    return this.form$.form<boolean>('is valid');
  }

  submit() {
    this.form$.form('submit');
  }

  render() {
    const {className, children} = this.props;
    return (
      <form ref="form" className={classNames('ui', className, 'form')}>
        {children}
      </form>
    );
  }
}
