import PropTypes from 'prop-types';
import React from 'react';

import SelectInput from './SelectInput';

const SelectInputAdapter = ({
  input,
  onChange,
  onNewOptionClick,
  ...rest
}) => (
  <SelectInput
    {...{ ...input, ...rest }}
    onChange={(option) => {
      input.onChange(option);
      if (onChange) onChange(option);
    }}
    onNewOptionClick={(option) => {
      if (onNewOptionClick) onNewOptionClick(option, input.onChange);
    }}
  />
);

SelectInputAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  onNewOptionClick: PropTypes.func,
};

export default SelectInputAdapter;
