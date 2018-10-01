import PropTypes from 'prop-types';
import React from 'react';
import throttle from 'lodash.throttle';

import SliderInput from './SliderInput';

const onAfterChangeHandler = throttle((onAfterChange, value) => {
  if (onAfterChange) onAfterChange(value);
}, 500);

const SliderAdapter = ({
  input,
  onAfterChange,
  ...rest
}) => (
  <SliderInput
    {...{ ...input, ...rest }}
    value={input.value || 0}
    onAfterChange={value => onAfterChangeHandler(onAfterChange, value)}
  />
);

SliderAdapter.propTypes = {
  input: PropTypes.object,
  onAfterChange: PropTypes.func,
};

export default SliderAdapter;
