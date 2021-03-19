import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './select.module.scss';

const cx = classNames.bind(css);

const Select = (props) => {
  const {
    className, label, optionsList, onChange, width, ...rest
  } = props;

  return (
    <div className={classNames(cx('select'), className)}>
      {label && (
        <span className={cx('label')}>{label}</span>
      )}
      <div className={cx('select-inner')} style={{ width }}>
        <select
          className={cx('select-input')}
          onChange={onChange}
          {...rest}
        >
          {optionsList.map(({ value: optionValue, key }) => (
            <option value={optionValue} key={key}>{key}</option>
          ))}
        </select>
        <i />
      </div>
    </div>
  );
};

Select.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  optionsList: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    key: PropTypes.string,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number,
};

Select.defaultProps = {
  className: '',
  label: null,
  width: 200,
};

export default Select;
