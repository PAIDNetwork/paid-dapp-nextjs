import React, { Component } from 'react';
import classNames from 'classnames';

interface StackedPasswordProps {
    id: string;
    innerRef?: any;
    label: string;
    name: string;
    placeholder?: string;
    groupClassNames?: string;
    labelClassNames?: string;
    inputClassNames?: string;
    errorComponent?: any;
    class?: string;
}

class StackedPassword extends Component<StackedPasswordProps> {
    state = {
      type: 'password',
      iconEye: 'fa fa-eye',
    };

    showHide = () => {
      this.setState({
        type: this.state.type === 'text' ? 'password' : 'text',
        iconEye: this.state.iconEye === 'fa fa-eye' ? 'fa fa-eye-slash' : 'fa fa-eye',
      });
    }

    render() {
      return (
        <div className={classNames('form-group stacked-group paid-component-password', this.props.groupClassNames)}>
          <label
            htmlFor={this.props.id}
            className={classNames('stacked-label', this.props.labelClassNames)}
          >
            {this.props.label}
          </label>
          <span className="paid-component-password__input">
            <input
              type={this.state.type}
              spellCheck="false"
              autoCorrect="off"
              name={this.props.name}
              autoComplete={this.props.name}
              placeholder={this.props.placeholder}
              id={this.props.id}
              ref={this.props.innerRef}
              className={classNames('form-control stacked-control', this.props.class)}
            />
            <i className={classNames('eye', this.state.iconEye)} aria-hidden="true" onClick={this.showHide} />
          </span>
          {this.props.errorComponent}
        </div>
      );
    }
}

export default StackedPassword;
