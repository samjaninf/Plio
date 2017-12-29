import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Title from './Title';

const DashboardStats = ({ className, children, ...props }) => (
  <div clasName={cx('dashboard-stats', className)} {...props}>
    {children}
  </div>
);

DashboardStats.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

DashboardStats.Title = Title;

export default DashboardStats;
