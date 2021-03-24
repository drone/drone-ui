import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as SearchIcon } from 'svg/search.svg';

import Label from '../label';

import css from './input.module.scss';

const cx = classNames.bind(css);

const ICONS = {
  search: <SearchIcon className={cx('icon', 'icon-search')} />,
};

const Input = (props) => {
  const {
    className, name, label, type, width, style, icon, ...rest
  } = props;
  return (
    <div className={cx('input-wrapper', className)}>
      {label && (
      <Label htmlFor={name}>
        {label}
      </Label>
      )}
      <div className={cx('input-inner')}>
        {icon && ICONS[icon]}
        <input
          className={classNames(cx('input', { 'input-with-icon': !!icon }))}
          type={type}
          name={name}
          id={name}
          style={{ width, ...style }}
          spellCheck="false"
          autoComplete="false"
          autoCorrect="false"
          {...rest}
        />
      </div>
    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.oneOf(['text', 'number', 'email', 'password']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape({}),
};

Input.defaultProps = {
  className: '',
  label: null,
  type: 'text',
  width: 200,
  style: {},
};

export default Input;
