import React from 'react';
import PropTypes from 'prop-types';
import { InputGroupAddon } from 'reactstrap';
import cx from 'classnames';

const InputGroupButton = ({ className, children, ...props }) => (
  <InputGroupAddon className={cx('input-group-btn', className)} {...props}>
    {children}
  </InputGroupAddon>
);

InputGroupButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default InputGroupButton;
