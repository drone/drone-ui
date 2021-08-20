import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as CheckboxCheckIcon } from 'svg/checkbox-check.svg';

import Label from '../label';

import css from './radio.module.scss';

const cx = classNames.bind(css);

const Radio = (props) => {
  const {
    className, label, name, disabled, appearance, ...rest
  } = props;
  const topping = appearance === 'circle' ? <i /> : <CheckboxCheckIcon />;
  return (
    <div className={classNames(cx('radio'), className)}>
      <input
        type="radio"
        id={name}
        name={name}
        {...rest}
        disabled={disabled}
        hidden
      />
      <label htmlFor={name} className={cx('radio-fake', { disabled }, `appearance-${appearance}`)}>
        {topping}
      </label>
      {label && (
        <Label className={cx('label')} htmlFor={name}>{label}</Label>
      )}
    </div>
  );
};

Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  appearance: PropTypes.oneOf(['circle', 'checkmark']),
};

Radio.defaultProps = {
  className: '',
  disabled: false,
  label: null,
  appearance: 'circle',
};

export default Radio;
