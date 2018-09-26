import PropTypes from 'prop-types';
import React from 'react';
import { Col as ReactstrapCol } from 'reactstrap';
import cx from 'classnames';

// Compatibility layer for our older version of bootstrap
// that doesn't support "col" class without "xs"
// https://github.com/reactstrap/reactstrap/blob/master/CHANGELOG.md#breaking-changes-6
const Col = ({ xs, className, ...props }) => (
  <ReactstrapCol className={cx(className, xs && `col-xs-${xs}`)} {...{ xs, ...props }} />
);

Col.propTypes = {
  xs: ReactstrapCol.propTypes.xs, // eslint-disable-line react/no-typos
  className: PropTypes.string,
};

export default Col;
