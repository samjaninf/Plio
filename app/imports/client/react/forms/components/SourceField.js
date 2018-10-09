import PropTypes from 'prop-types';
import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Field } from 'react-final-form';

const renderSource = ({ input, onChange, ...rest }) => (
  <Blaze
    {...{ ...input, ...rest }}
    template="ESSources"
    onChange={(value) => {
      input.onChange(value);
      if (onChange) onChange(value);
    }}
  />
);

renderSource.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const SourceField = props => (
  <Field
    {...props}
    component={renderSource}
  />
);

export default SourceField;
