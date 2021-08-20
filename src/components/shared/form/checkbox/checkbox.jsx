import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as CheckboxCheckIcon } from 'svg/checkbox-check.svg';

import Label from '../label';

import css from './checkbox.module.scss';

const cx = classNames.bind(css);

const Checkbox = (props) => {
  const {
    className, label, name, checked, disabled, ...rest
  } = props;
  return (
    <div className={classNames(cx('checkbox'), className)}>
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        disabled={disabled}
        {...rest}
        hidden
      />
      <label htmlFor={name} className={cx('checkbox-fake', { disabled })}>
        <CheckboxCheckIcon />
      </label>
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  className: '',
  disabled: false,
};
