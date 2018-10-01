import React from 'react';
import PropTypes from 'prop-types';
import { InputGroupAddon } from 'reactstrap';
import cx from 'classnames';

const InputAddon = ({ className, children, ...props }) => (
  <InputGroupAddon className={cx('input-group-addon', className)} {...props}>
    {children}
  </InputGroupAddon>
);

InputAddon.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default InputAddon;
