import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const FormControlStatic = ({ tag: Tag = 'p', className, ...props }) => (
  <Tag {...props} className={cx('form-control-static', className)} />
);

FormControlStatic.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
};

export default FormControlStatic;
