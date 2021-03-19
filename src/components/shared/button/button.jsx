import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './button.module.scss';

const cx = classNames.bind(styles);

const Button = (props) => {
  const {
    as, children, className, label, icon, size, theme, ...rest
  } = props;

  let Tag;
  switch (as) {
    case 'link':
      Tag = Link;
      break;
    case 'a':
      Tag = 'a';
      break;
    case 'button':
    default:
      Tag = 'button';
  }

  let content = (
    <>
      {icon}
      <span>{label || children}</span>
    </>
  );

  if (theme === 'plain') {
    content = children;
  }

  return <Tag className={cx('button', `theme-${theme}`, `size-${size}`, className || '')} {...rest}>{content}</Tag>;
};

Button.propTypes = {
  as: PropTypes.oneOf(['link', 'a', 'button']),
  theme: PropTypes.oneOf(['plain', 'primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
  type: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

Button.defaultProps = {
  theme: 'plain',
  as: 'button',
  className: '',
  label: '',
  type: 'button',
  icon: null,
  children: null,
  size: 'md',
};

export default Button;
