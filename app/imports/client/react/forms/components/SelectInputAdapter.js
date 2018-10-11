import PropTypes from 'prop-types';
import React from 'react';
import { append } from 'ramda';

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
    onNewOptionClick={(rawOption) => {
      if (onNewOptionClick) {
        onNewOptionClick(rawOption, (option) => {
          const options = rest.multi ? append(option, input.value) : option;
          input.onChange(options);
          if (onChange) onChange(options);
        });
      }
    }}
  />
);

SelectInputAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  onNewOptionClick: PropTypes.func,
};

export default SelectInputAdapter;
