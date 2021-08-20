import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './form.module.scss';

const cx = classNames.bind(css);

const Form = (props) => {
  const {
    title, className, children, ...rest
  } = props;

  return (
    <form
      className={classNames(cx('form'), className)}
      spellCheck="false"
      autoCapitalize="false"
      autoCorrect="false"
      autoComplete="false"
      {...rest}
    >
      {title && (
      <h2 className={cx('form-title')}>{title}</h2>
      )}
      {children}
    </form>
  );
};

export const FormSection = ({ title, className, children }) => (
  <div className={classNames(cx('form-section'), className)}>
    {title && (
      <h3>{title}</h3>
    )}
    {children}
  </div>
);

const commonTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  children: PropTypes.node,
};

FormSection.propTypes = commonTypes;
FormSection.defaultProps = {
  className: '',
  title: null,
  children: null,
};

Form.propTypes = commonTypes;

Form.defaultProps = {
  className: '',
  title: null,
  children: null,
};

export default Form;
