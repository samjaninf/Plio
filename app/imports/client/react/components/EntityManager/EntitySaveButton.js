import React from 'react';
import { FormSpy } from 'react-final-form';

import SaveButton from '../Buttons/SaveButton';

const EntityManagerSaveButton = props => (
  <FormSpy subscription={{ submitting: true }}>
    {({ submitting }) => (
      <SaveButton
        color="secondary"
        type="submit"
        isSaving={submitting}
        {...props}
      />
    )}
  </FormSpy>
);

export default EntityManagerSaveButton;
