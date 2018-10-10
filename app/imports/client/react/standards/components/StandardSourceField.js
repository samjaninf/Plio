import PropTypes from 'prop-types';
import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Field } from 'react-final-form';

import { WithState } from '../../helpers';
// import '../../../../ui/components/standards/includes/fields/sources';

const renderSource = ({ input, onChange, ...rest }) => (
  <WithState
    initialState={{
      value: input.value,
    }}
  >
    {({ state: { value = {} }, setState }) => (
      <Blaze
        {...{ ...input, ...rest }}
        template="ESSources"
        sourceType={value.type}
        sourceUrl={value.url}
        sourceFileId={value.fileId}
        sourceHtmlUrl={value.htmlUrl}
        onChange={({ source }) => {
          input.onChange(source);
          setState({ value: source });
          if (onChange) onChange(source);
        }}
      />
    )}
  </WithState>
);

renderSource.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

const StandardSourceField = props => (
  <Field
    {...props}
    component={renderSource}
  />
);

export default StandardSourceField;
