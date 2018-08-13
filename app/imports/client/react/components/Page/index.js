import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const defaults = {
  classNames: {
    lhs: 'content-list scroll',
    rhs: 'content-cards scroll',
  },
};

const Page = ({
  classNames = defaults.classNames,
  displayRHS = true,
  children,
  isFullScreenMode,
}) => (
  <div className="row">
    <div className={cx(classNames.lhs, { 'hidden-sm-down': displayRHS })}>
      {children[0]}
    </div>
    <div
      className={cx(classNames.rhs, {
        'hidden-sm-down': !displayRHS,
        expanded: isFullScreenMode,
      })}
    >
      {children[1]}
    </div>
  </div>
);

Page.propTypes = propTypes;

export default Page;
