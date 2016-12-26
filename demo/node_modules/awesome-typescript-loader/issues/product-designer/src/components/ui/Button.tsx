import * as React from 'react';
import * as classNames from 'classnames';

import 'semantic-ui-css/components/button.css';

interface IProps {
  className?: string;
  disabled?: boolean;
  title?: string;
  onClick?: (event: React.MouseEvent<any>) => void;
}

export class Button extends React.Component<IProps, any> {
  render() {
    const {className, children, title, disabled, onClick} = this.props;
    const cls = classNames('ui', disabled ? 'disabled' : undefined, className, 'button');

    const props: any = {};
    if (disabled) { props.disabled = true; }
    if (title) { props.title = title; }
    if (onClick) {
      props.onClick = onClick;
    }

    return <div className={cls} {...props}>{children}</div>;
  }
}
