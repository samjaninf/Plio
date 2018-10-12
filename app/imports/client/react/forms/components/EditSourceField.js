import PropTypes from 'prop-types';
import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Field } from 'react-final-form';

const renderSource = ({ input, onChange, ...rest }) => (
  <Blaze
    {...{ ...input, ...rest }}
    template="ESSources"
    sourceType={input.value.type}
    sourceUrl={input.value.url}
    sourceFileId={input.value.fileId}
    onChangeSource={(source = null) => {
      input.onChange(source);
      if (onChange) onChange(source);
    }}
  />
);

renderSource.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const EditSourceField = props => (
  <Field
    {...props}
    component={renderSource}
  />
);

export default EditSourceField;
