import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './switch.module.scss';

const cx = classNames.bind(css);

const Switch = (props) => {
  const {
    id, className, checked, onChange, children, disabled,
  } = props;
  return (
    <div className={cx('wrapper', className)}>
      <input
        className={cx('switch-input')}
        id={id}
        disabled={disabled}
        checked={checked}
        type="checkbox"
        onChange={({ target: { checked: check } }) => onChange(check)}
      />
      <label className={cx('switch-label')} htmlFor={id}>
        <i className={cx('switch-toggler')} />
      </label>
      {children && (
        <span className={cx('switch-label-fake')}>{children}</span>
      )}
    </div>
  );
};

export default Switch;

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Switch.defaultProps = {
  checked: false,
  children: undefined,
  disabled: false,
  className: '',
};
