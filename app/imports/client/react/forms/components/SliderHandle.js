import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import { Handle } from 'rc-slider';
import { identity } from 'ramda';

const SliderHandle = ({
  dragging,
  id,
  tipFormatter,
  ...rest
}) => (
  <Fragment>
    <Handle {...{ id, ...rest }} />
    <Tooltip
      target={id}
      isOpen={dragging}
      placement="top"
    >
      {tipFormatter(rest.value)}
    </Tooltip>
  </Fragment>
);

SliderHandle.defaultProps = {
  tipFormatter: identity,
};

SliderHandle.propTypes = {
  dragging: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  tipFormatter: PropTypes.func,
};

export default SliderHandle;
