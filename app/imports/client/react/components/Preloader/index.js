import PropTypes from 'prop-types';
import React from 'react';
import { withProps } from 'recompose';

import Icon from '../Icons/Icon';
import { getSizeClassName } from './constants';
import { transsoc } from '../../../../api/helpers';

const enhance = withProps(transsoc({ iconClassName: getSizeClassName }));

const Preloader = enhance(({
  className,
  iconClassName,
  size = 1,
  ...other
}) => (
  <span {...{ className }}>
    <Icon
      name="circle-o-notch spin fw"
      margin="bottom"
      {...{ ...other, size, className: iconClassName }}
    />
    <br />
  </span>
));

Preloader.propTypes = {
  className: PropTypes.string,
};

export default Preloader;
