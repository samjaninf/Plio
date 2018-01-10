import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const Select = ({
  value,
  options,
  className,
  onChange,
}) => (
  <div className="dropdown">
    <select className={cx('form-control c-select', className)} {...{ value, onChange }}>
      {options.map(option => (
        <option key={`${option.value}-${option.text}`} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  </div>
);

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Select;
