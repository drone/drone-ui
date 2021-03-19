import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './label.module.scss';

const cx = classNames.bind(css);

const Label = (props) => {
  const {
    className, htmlFor, children, ...rest
  } = props;
  return (
    <label
      className={classNames(cx('label'), className)}
      htmlFor={htmlFor}
      {...rest}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  className: PropTypes.string,
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Label.defaultProps = {
  className: '',
  children: null,
};

export default Label;
