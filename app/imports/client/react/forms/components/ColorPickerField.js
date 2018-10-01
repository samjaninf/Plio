import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

import ColorPicker from '../../components/ColorPicker';

const renderColorPicker = ({ input, onChange, ...rest }) => (
  <ColorPicker
    {...{ ...input, ...rest }}
    onChange={(color) => {
      const hex = color.hex.toUpperCase();
      input.onChange(hex);
      if (onChange) {
        onChange({ ...color, hex });
      }
    }}
  />
);

renderColorPicker.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const ColorPickerField = props => (
  <Field
    {...props}
    component={renderColorPicker}
  />
);

export default ColorPickerField;
