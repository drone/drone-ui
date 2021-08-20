import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import Label from '../label';

import css from './text-area.module.scss';

const cx = classNames.bind(css);

const TextArea = (props) => {
  const {
    className, name, label, width, ...rest
  } = props;
  return (
    <div className={classNames(cx('text-area-wrapper'), className)}>
      {label && (
      <Label htmlFor={name}>{label}</Label>
      )}
      <textarea
        className={cx('text-area')}
        name={name}
        id={name}
        style={{ width }}
        autoCapitalize="false"
        autoComplete="false"
        autoCorrect="false"
        spellCheck="false"
        {...rest}
      />
    </div>
  );
};

TextArea.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

TextArea.defaultProps = {
  className: '',
  width: 400,
  label: null,
};

export default TextArea;
