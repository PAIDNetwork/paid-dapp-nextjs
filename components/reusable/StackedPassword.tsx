import React, { FC, useState } from 'react';
import classNames from 'classnames';

interface StackedPasswordProps {
  id: string;
  innerRef?: any;
  label: string;
  name: string;
  placeholder?: string;
  groupClassNames?: string;
  labelClassNames?: string;
  errorComponent?: any;
  className?: string;
}

const StackedPassword: FC<StackedPasswordProps> = ({
  id,
  innerRef,
  label,
  name,
  placeholder,
  groupClassNames,
  labelClassNames,
  errorComponent,
  className,
}: StackedPasswordProps) => {
  const [hide, setHide] = useState(true);

  return (
    <div className={classNames('form-group stacked-group paid-component-password', groupClassNames)}>
      <label
        htmlFor={id}
        className={classNames('stacked-label', labelClassNames)}
      >
        {label}
      </label>
      <span className="paid-component-password__input">
        <input
          type={hide ? 'password' : 'text'}
          spellCheck="false"
          autoCorrect="off"
          name={name}
          autoComplete={name}
          placeholder={placeholder}
          id={id}
          ref={innerRef}
          className={classNames('form-control stacked-control', className)}
        />
        <i className={classNames('eye', hide ? 'fa fa-eye-slash' : 'fa fa-eye')} aria-hidden="true" onClick={() => setHide(!hide)} />
      </span>
      {errorComponent}
    </div>
  );
};

export default StackedPassword;
