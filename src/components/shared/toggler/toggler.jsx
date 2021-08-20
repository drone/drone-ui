import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import css from './toggler.module.scss';

const cx = classNames.bind(css);

const Toggler = (props) => {
  const {
    className, options, onOptionSelect, initialSelected,
  } = props;
  const [currentOption, setCurrentOption] = useState(initialSelected);
  const handleOptionClick = (optionIdx) => () => {
    setCurrentOption(optionIdx);
    onOptionSelect(options[optionIdx].value);
  };
  return (
    <div className={cx('wrapper', className)}>
      {options.map((option, optionIdx) => (
        <button
          key={optionIdx}
          className={cx('option', { 'option-selected': optionIdx === currentOption })}
          type="button"
          onClick={handleOptionClick(optionIdx)}
        >
          {option.label}

        </button>
      ))}
    </div>
  );
};

Toggler.propTypes = {
  initialSelected: PropTypes.number,
  className: PropTypes.string,
  onOptionSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

Toggler.defaultProps = {
  initialSelected: 0,
  className: '',
  onOptionSelect: () => {},
};

export default Toggler;
