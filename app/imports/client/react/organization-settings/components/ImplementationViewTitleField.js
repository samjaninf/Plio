import PropTypes from 'prop-types';
import React from 'react';

import swal from '/imports/ui/utils/swal';
import { SelectInputField } from '../../components';
import { getWorkspaceTitleOption } from '../helpers';

const ImplementationViewTitleField = props => (
  <SelectInputField
    {...props}
    promptTextCreator={selectedLabel => `Add "${selectedLabel}" title`}
    placeholder="Select a title..."
    type="creatable"
    onNewOptionClick={({ value }, callback) => {
      if (!value) return;
      swal({
        title: 'Are you sure?',
        text: `New title "${value}" will replace the current one.`,
        confirmButtonText: 'Add',
        showCancelButton: true,
        type: 'warning',
      }, () => {
        const newOption = getWorkspaceTitleOption(props.name, value);

        if (callback) callback(newOption);
        props.onChange().then(() =>
          swal.success('Added!', `Title "${value}" was added successfully.`));
      });
    }}
  />
);

ImplementationViewTitleField.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ImplementationViewTitleField;
