import React, { FC, InputHTMLAttributes } from 'react';
import classNames from 'classnames';

// eslint-disable-next-line no-undef
interface StackedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  innerRef?: any;
  readOnly?: boolean;
  groupClassNames?: string;
  labelClassNames?: string;
  inputClassNames?: string;
  errorComponent?: any;
  value?: string;
}

const StackedInput: FC<StackedInputProps> = ({
  label,
  name,
  type,
  placeholder,
  innerRef,
  readOnly,
  groupClassNames,
  labelClassNames,
  inputClassNames,
  errorComponent,
  value,
}: StackedInputProps) => (
  <div className={classNames('form-group stacked-group', groupClassNames)}>
    <label
      htmlFor={name}
      className={classNames('stacked-label', labelClassNames)}
    >
      {label}
    </label>
    {readOnly && value ? (
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={classNames('form-control stacked-control', inputClassNames)}
        ref={innerRef}
        readOnly={readOnly}
        value={value}
      />
    ) : (
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={classNames('form-control stacked-control', inputClassNames)}
        ref={innerRef}
        readOnly={readOnly}
      />
    )}
    {errorComponent}
  </div>
);

StackedInput.defaultProps = {
  innerRef: null,
  groupClassNames: '',
  labelClassNames: '',
  inputClassNames: '',
  errorComponent: null,
  readOnly: false,
  value: '',
};

export default StackedInput;
